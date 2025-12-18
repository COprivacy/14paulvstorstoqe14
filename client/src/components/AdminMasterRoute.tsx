import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useUser } from "@/hooks/use-user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminMasterRouteProps {
  children: ReactNode;
}

const AUTHORIZED_EMAIL = import.meta.env.VITE_MASTER_USER_EMAIL || "pavisoft.suporte@gmail.com";
const AUTHORIZED_USER_ID = "pavisoft-admin-001";

export function AdminMasterRoute({ children }: AdminMasterRouteProps) {
  const { user, isLoading: isUserLoading } = useUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Aguardar carregamento do usuário antes de qualquer verificação
    if (isUserLoading) {
      console.log("⏳ AdminMasterRoute: Carregando dados do usuário...");
      setIsCheckingAuth(true);
      return;
    }

    // Após carregar, verificar se o usuário existe
    if (!user) {
      console.log("❌ AdminMasterRoute: Nenhum usuário logado, redirecionando para login");
      setLocation("/login");
      setIsCheckingAuth(false);
      return;
    }

    console.log("🔍 AdminMasterRoute: Verificando credenciais do usuário", {
      userId: user.id,
      email: user.email,
      isAdmin: user.is_admin,
      expectedId: AUTHORIZED_USER_ID,
      expectedEmail: AUTHORIZED_EMAIL
    });

    // VALIDAÇÃO CRÍTICA: Apenas o usuário específico pode acessar (por ID E por email)
    if (user.id !== AUTHORIZED_USER_ID || user.email !== AUTHORIZED_EMAIL) {
      console.log(`❌ AdminMasterRoute: Usuário não autorizado (ID: ${user.id}, Email: ${user.email}), redirecionando para dashboard`);
      setLocation("/dashboard");
      setIsCheckingAuth(false);
      return;
    }

    if (user.is_admin !== "true") {
      console.log(`❌ AdminMasterRoute: Usuário não é admin (${user.email}), redirecionando para dashboard`);
      setLocation("/dashboard");
      setIsCheckingAuth(false);
      return;
    }

    // SEMPRE LIMPAR sessionStorage ao carregar a página pela primeira vez
    // Isso garante que a senha seja solicitada em cada novo acesso
    console.log("🔐 AdminMasterRoute: Limpando sessão anterior e solicitando senha");
    sessionStorage.removeItem("admin_master_auth");
    setIsAuthenticated(false);
    
    setIsCheckingAuth(false);
  }, [user, isUserLoading, setLocation]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify-master-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || "",
          "x-user-email": user?.email || "",
          "x-is-admin": user?.is_admin || "false",
        },
        body: JSON.stringify({ password }),
      });

      if (response.status === 429) {
        const result = await response.json();
        toast({
          title: "Bloqueado temporariamente",
          description: result.error,
          variant: "destructive",
        });
        setIsLoading(false);
        setPassword("");
        return;
      }

      if (response.status === 403) {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar esta área",
          variant: "destructive",
        });
        setLocation("/dashboard");
        return;
      }

      const result = await response.json();

      if (result.valid) {
        setIsAuthenticated(true);
        sessionStorage.setItem("admin_master_auth", "true");
        toast({
          title: "Acesso autorizado",
          description: "Bem-vindo ao Admin Master",
        });
      } else {
        toast({
          title: "Senha incorreta",
          description: "A senha de acesso está incorreta",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao verificar senha:", error);
      toast({
        title: "Erro",
        description: "Não foi possível verificar a senha. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setPassword("");
    }
  };

  // Mostra loading enquanto verifica autenticação ou carrega dados do usuário
  if (isCheckingAuth || isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Se não for o usuário autorizado, não renderiza nada (o useEffect já fez o redirect)
  if (!user || user.id !== AUTHORIZED_USER_ID || user.email !== AUTHORIZED_EMAIL || user.is_admin !== "true") {
    console.log("⚠️ AdminMasterRoute: Renderização bloqueada - credenciais inválidas");
    return null;
  }

  console.log("✅ AdminMasterRoute: Renderizando conteúdo protegido");

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
        <Card className="max-w-md w-full">
          <CardHeader className="space-y-2">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-4">
                <Lock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Admin Master</CardTitle>
            <CardDescription className="text-center">
              Digite a senha de acesso para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="master-password">Senha de Acesso</Label>
                <div className="relative">
                  <Input
                    id="master-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite a senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoFocus
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="button-toggle-master-password"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verificando..." : "Acessar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}