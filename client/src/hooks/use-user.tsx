import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { useLocation } from "wouter";
import type { User } from "@shared/schema";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAdmin: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Função para sanitizar dados do usuário (remover senha)
const sanitizeUserData = (user: User): User => {
  const { senha, ...sanitizedUser } = user as any;
  return sanitizedUser as User;
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return null;

    try {
      const parsed = JSON.parse(savedUser);
      // Garantir que senha nunca seja carregada do localStorage
      const { senha, ...sanitized } = parsed;
      return sanitized as User;
    } catch {
      return null;
    }
  });

  const isAdmin = user?.is_admin === "true" || user?.is_admin === true;

  const refreshUser = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/users/${user.id}`);
      if (response.ok) {
        const updatedUser = await response.json();
        const sanitized = sanitizeUserData(updatedUser);
        setUser(sanitized);
        localStorage.setItem("user", JSON.stringify(sanitized));
      }
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
    }
  };

  useEffect(() => {
    // Atualizar localStorage quando o usuário mudar (SEM senha)
    if (user) {
      const sanitized = sanitizeUserData(user);
      localStorage.setItem("user", JSON.stringify(sanitized));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, isAdmin, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const [, setLocation] = useLocation();

  const { data: user, isLoading, error, refetch } = useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        throw new Error("No user found");
      }
      const user = JSON.parse(userStr) as User;

      // Verificar expiração no servidor
      try {
        const response = await apiRequest("POST", "/api/auth/check-expiration");
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            // Atualizar localStorage com dados atualizados
            localStorage.setItem("user", JSON.stringify(data.user));
            return data.user;
          }
        }
      } catch (checkError) {
        console.warn("Erro ao verificar expiração, usando dados locais:", checkError);
      }

      return user;
    },
    retry: false,
    staleTime: 0,
    refetchInterval: 60000, // Revalidar a cada 1 minuto
  });

  const logout = async () => {
    localStorage.removeItem("user");
    setLocation("/login");
  };

  const checkExpiration = async () => {
    try {
      const response = await apiRequest("POST", "/api/auth/check-expiration");
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          await refetch();
          return data;
        }
      }
    } catch (error) {
      console.error("Erro ao verificar expiração:", error);
    }
    return null;
  };

  return { user, isLoading, error, logout, refetch, checkExpiration };
}