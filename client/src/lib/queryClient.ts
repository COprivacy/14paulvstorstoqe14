import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

function getAuthHeaders(): Record<string, string> {
  const userStr = localStorage.getItem("user");
  if (!userStr) return {};
  
  try {
    const user = JSON.parse(userStr);
    const headers: Record<string, string> = {
      "x-user-id": user.id,
      "x-user-type": user.tipo || "usuario",
    };
    
    // Verificação robusta para is_admin (pode ser boolean, string ou number)
    const isAdmin = user.is_admin === true || 
                    user.is_admin === "true" || 
                    user.is_admin === 1 || 
                    user.is_admin === "1";
    
    if (isAdmin) {
      headers["x-is-admin"] = "true";
    }
    
    if (user.tipo === "funcionario" && user.conta_id) {
      headers["x-conta-id"] = user.conta_id;
    }
    
    console.log("[AUTH_HEADERS] Headers gerados:", headers, "is_admin original:", user.is_admin);
    
    return headers;
  } catch (e) {
    console.error("[AUTH_HEADERS] Erro ao parsear user:", e);
    return {};
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const authHeaders = getAuthHeaders();
  
  const res = await fetch(url, {
    method,
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
      ...authHeaders,
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const authHeaders = getAuthHeaders();
    
    const pathSegments: (string | number)[] = [];
    let queryParams: Record<string, any> = {};
    
    for (const segment of queryKey) {
      if (typeof segment === "string" || typeof segment === "number") {
        pathSegments.push(segment);
      } else if (typeof segment === "object" && segment !== null) {
        queryParams = { ...queryParams, ...segment };
      }
    }
    
    let url = pathSegments.join("/");
    
    if (Object.keys(queryParams).length > 0) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      }
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    const res = await fetch(url, {
      credentials: "include",
      headers: authHeaders,
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: true, // Atualizar quando a janela ganhar foco
      staleTime: 30 * 1000, // Dados considerados "velhos" após 30 segundos
      gcTime: 5 * 60 * 1000, // Garbage collection após 5 minutos
      retry: 1,
      retryDelay: 1000,
    },
    mutations: {
      retry: false,
    },
  },
});
