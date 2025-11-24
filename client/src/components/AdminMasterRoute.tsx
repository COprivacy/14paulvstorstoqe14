import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useUser } from "@/hooks/use-user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Aguardar carregamento do usuário antes de verificar
    if (isUserLoading) {
      console.log("⏳ AdminMasterRoute: Carregando dados do usuário...");
      return;
    }

    // Verifica autenticação do usuário
    if (!user) {
      console.log("❌ AdminMasterRoute: Nenhum usuário logado, redirecionando para login");
      setLocation("/login");
      return;
    }

    // VALIDAÇÃO CRÍTICA: Apenas o usuário específico pode acessar (por ID E por email)
    if (user.id !== AUTHORIZED_USER_ID || user.email !== AUTHORIZED_EMAIL) {
      console.log(`❌ AdminMasterRoute: Usuário não autorizado (ID: ${user.id}, Email: ${user.email}), redirecionando para dashboard`);
      setLocation("/dashboard");
      return;
    }

    if (user.is_admin !== "true") {
      console.log(`❌ AdminMasterRoute: Usuário não é admin (${user.email}), redirecionando para dashboard`);
      setLocation("/dashboard");
      return;
    }

    // Verificar se já está autenticado na sessão
    const sessionAuth = sessionStorage.getItem("admin_master_auth");
    if (sessionAuth === "true") {
      console.log("✅ AdminMasterRoute: Sessão admin_master já autenticada");
      setIsAuthenticated(true);
    }
    
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

  // Mostra loading enquanto verifica autenticação
  if (isCheckingAuth) {
    return null;
  }

  // Se não for o usuário autorizado, não renderiza nada (o useEffect já fez o redirect)
  if (!user || user.id !== AUTHORIZED_USER_ID || user.email !== AUTHORIZED_EMAIL || user.is_admin !== "true") {
    return null;
  }

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
                <Input
                  id="master-password"
                  type="password"
                  placeholder="Digite a senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                />
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