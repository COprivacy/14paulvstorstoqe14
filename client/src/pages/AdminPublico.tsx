import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  DollarSign,
  CreditCard,
  TrendingUp,
  Loader2,
  RefreshCw,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  Search,
  UserPlus,
  FileText,
  Eye,
  Trash2,
  ExternalLink,
  Ban,
  Activity,
  BarChart3,
  Calendar,
  Edit2,
  Mail,
  Phone,
  MapPin,
  Save,
  X,
  User,
  LineChart,
  Clock,
  Sparkles,
  Menu,
  Bell,
  LogOut,
  Database,
  Zap,
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Cliente360Timeline } from "@/components/Cliente360Timeline";
import { Cliente360Notes } from "@/components/Cliente360Notes";
import { AdminLogsView } from "@/components/AdminLogsView";

// Tipos e Interfaces
type MercadoPagoConfig = {
  access_token: string;
  public_key: string;
  webhook_url: string;
  status_conexao?: string;
};

type HealthCheck = {
  name: string;
  status: 'healthy' | 'degraded' | 'critical';
  message: string;
  details?: any;
  autoFixed?: boolean;
};

type HealthStatus = {
  checks: HealthCheck[];
  summary: {
    healthy: number;
    degraded: number;
    critical: number;
    autoFixed: number;
  };
  lastCheck: string;
};

// Componente de Edição/Criação de Usuário
function UserEditDialog({
  user,
  open,
  onOpenChange
}: {
  user?: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    nome: user?.nome || "",
    email: user?.email || "",
    senha: "",
    plano: user?.plano || "free",
    status: user?.status || "ativo",
    cpf_cnpj: user?.cpf_cnpj || "",
    telefone: user?.telefone || "",
    endereco: user?.endereco || "",
    max_funcionarios: user?.max_funcionarios || 1,
    data_expiracao_plano: user?.data_expiracao_plano || user?.data_expiracao_trial || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || "",
        email: user.email || "",
        senha: "",
        plano: user.plano || "free",
        status: user.status || "ativo",
        cpf_cnpj: user.cpf_cnpj || "",
        telefone: user.telefone || "",
        endereco: user.endereco || "",
        max_funcionarios: user.max_funcionarios || 1,
        data_expiracao_plano: user.data_expiracao_plano || user.data_expiracao_trial || "",
      });
    }
  }, [user]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (user) {
        // Atualizar usuário existente
        const updateData: Partial<typeof formData> = { ...formData };
        if (!updateData.senha) delete updateData.senha; // Não enviar senha vazia
        const response = await apiRequest("PATCH", `/api/users/${user.id}`, updateData);
        return response.json();
      } else {
        // Criar novo usuário
        const response = await apiRequest("POST", "/api/auth/register", formData);
        return response.json();
      }
    },
    onSuccess: () => {
      toast({
        title: user ? "Usuário atualizado!" : "Usuário criado!",
        description: user ? "As informações foram atualizadas com sucesso." : "O novo usuário foi criado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{user ? "Editar Usuário" : "Criar Novo Usuário"}</DialogTitle>
          <DialogDescription>
            {user ? "Atualize as informações do usuário" : "Preencha os dados para criar um novo usuário"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
                disabled={!!user} // Email não pode ser editado
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Senha {user ? "(deixe em branco para manter a atual)" : "*"}</Label>
            <Input
              type="password"
              value={formData.senha}
              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              placeholder={user ? "Digite para alterar a senha" : "Digite a senha"}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Plano</Label>
              <Select value={formData.plano} onValueChange={(value) => setFormData({ ...formData, plano: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="premium_mensal">Premium Mensal</SelectItem>
                  <SelectItem value="premium_anual">Premium Anual</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="bloqueado">Bloqueado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>CPF/CNPJ</Label>
              <Input
                value={formData.cpf_cnpj}
                onChange={(e) => setFormData({ ...formData, cpf_cnpj: e.target.value })}
                placeholder="000.000.000-00"
              />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Endereço</Label>
            <Input
              value={formData.endereco}
              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              placeholder="Endereço completo"
            />
          </div>

          <div className="space-y-2">
            <Label>Máximo de Funcionários</Label>
            <Input
              type="number"
              min="1"
              value={formData.max_funcionarios}
              onChange={(e) => setFormData({ ...formData, max_funcionarios: parseInt(e.target.value) })}
            />
          </div>

          {user && (
            <div className="space-y-2">
              <Label>Dias de Plano Restantes</Label>
              <Input
                type="number"
                min="0"
                value={
                  user.data_expiracao_plano || user.data_expiracao_trial
                    ? Math.max(
                        0,
                        Math.ceil(
                          (new Date(user.data_expiracao_plano || user.data_expiracao_trial!).getTime() -
                           new Date().getTime()) / (1000 * 60 * 60 * 24)
                        )
                      )
                    : 0
                }
                onChange={(e) => {
                  const dias = parseInt(e.target.value) || 0;
                  const novaData = new Date();
                  novaData.setDate(novaData.getDate() + dias);
                  setFormData({
                    ...formData,
                    data_expiracao_plano: novaData.toISOString()
                  });
                }}
              />
              <p className="text-xs text-muted-foreground">
                Define quantos dias o plano permanecerá ativo
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {user ? "Salvar Alterações" : "Criar Usuário"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Componente de Gestão Avançada de Usuários
function GestaoAvancadaTab({ users }: { users: User[] }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filtroPlano, setFiltroPlano] = useState<string>("todos");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");

  // Estatísticas por plano
  const estatisticasPorPlano = useMemo(() => {
    const stats: Record<string, number> = {};
    users.forEach(user => {
      stats[user.plano] = (stats[user.plano] || 0) + 1;
    });
    return stats;
  }, [users]);

  // Usuários filtrados
  const usuariosFiltrados = useMemo(() => {
    return users.filter(user => {
      const passaPlano = filtroPlano === "todos" || user.plano === filtroPlano;
      const passaStatus = filtroStatus === "todos" || user.status === filtroStatus;
      return passaPlano && passaStatus;
    });
  }, [users, filtroPlano, filtroStatus]);

  const alterarPlanoEmLote = useMutation({
    mutationFn: async ({ userIds, novoPlano }: { userIds: string[], novoPlano: string }) => {
      const promises = userIds.map(id =>
        apiRequest("PATCH", `/api/users/${id}`, { plano: novoPlano })
      );
      await Promise.all(promises);
    },
    onSuccess: () => {
      toast({
        title: "Planos alterados!",
        description: "Os planos foram atualizados com sucesso",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao alterar planos",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{users.length}</p>
              <p className="text-sm text-muted-foreground">Total de Usuários</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {users.filter(u => u.status === 'ativo').length}
              </p>
              <p className="text-sm text-muted-foreground">Usuários Ativos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {users.filter(u => u.plano === 'premium' || u.plano === 'premium_mensal' || u.plano === 'premium_anual').length}
              </p>
              <p className="text-sm text-muted-foreground">Assinantes Premium</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {users.filter(u => u.plano === 'trial').length}
              </p>
              <p className="text-sm text-muted-foreground">Em Trial</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição por Plano */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Distribuição por Plano
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(estatisticasPorPlano).map(([plano, quantidade]) => (
              <div key={plano} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{plano}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {((quantidade / users.length) * 100).toFixed(1)}% dos usuários
                  </span>
                </div>
                <span className="font-semibold">{quantidade}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filtros e Ações em Lote */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            Filtros e Ações em Lote
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Filtrar por Plano</Label>
              <Select value={filtroPlano} onValueChange={setFiltroPlano}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Planos</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="premium_mensal">Premium Mensal</SelectItem>
                  <SelectItem value="premium_anual">Premium Anual</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Filtrar por Status</Label>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="bloqueado">Bloqueado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">
              {usuariosFiltrados.length} usuários encontrados com os filtros aplicados
            </p>
            <p className="text-xs text-muted-foreground">
              Use os filtros acima para refinar a busca e realizar ações em lote
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente de Configuração Mercado Pago
function MercadoPagoConfigTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [mpConfig, setMpConfig] = useState({
    access_token: "",
    public_key: "",
    webhook_url: "" // Adicionado campo webhook_url
  });

  // Carregar configuração do Mercado Pago
  const { data: mpConfigData, isLoading: isLoadingMpConfig } = useQuery<MercadoPagoConfig>({
    queryKey: ["/api/config-mercadopago"],
    retry: 1,
  });

  useEffect(() => {
    if (mpConfigData) {
      setMpConfig({
        access_token: mpConfigData.access_token || "",
        public_key: mpConfigData.public_key || "",
        webhook_url: mpConfigData.webhook_url || ""
      });
    }
  }, [mpConfigData]);

  const saveMercadoPagoConfig = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/config-mercadopago", mpConfig);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Configuração salva!",
        description: "As configurações do Mercado Pago foram atualizadas.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/config-mercadopago"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const testMercadoPagoConnection = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/config-mercadopago/test", {
        access_token: mpConfig.access_token,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: data.success ? "✅ Conexão bem-sucedida!" : "❌ Falha na conexão",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Erro ao testar conexão",
        description: error.message || "Erro desconhecido ao conectar com Mercado Pago",
        variant: "destructive",
      });
    },
  });

  // Status da integração
  const getIntegrationStatus = () => {
    if (isLoadingMpConfig) return { color: "bg-gray-500", text: "Verificando...", icon: Loader2 };
    if (!mpConfigData || !mpConfigData.access_token) return { color: "bg-red-500", text: "Não Configurado", icon: XCircle };
    if (mpConfigData.status_conexao === "conectado") return { color: "bg-green-500", text: "Conectado", icon: CheckCircle };
    return { color: "bg-yellow-500", text: "Configurado (não testado)", icon: AlertCircle };
  };

  const status = getIntegrationStatus();
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      {/* Status da Integração Mercado Pago */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Status da Integração
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${status.color} rounded-full`}>
                <StatusIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold">Mercado Pago</p>
                <p className="text-sm text-muted-foreground">Gateway de Pagamento</p>
              </div>
            </div>
            <Badge className={status.color}>{status.text}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Configuração Mercado Pago */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            Credenciais da API
          </CardTitle>
          <CardDescription>
            Configure as credenciais da API do Mercado Pago para processar pagamentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Access Token</Label>
            <Input
              type="text"
              value={mpConfig.access_token}
              onChange={(e) => setMpConfig({ ...mpConfig, access_token: e.target.value })}
              placeholder="APP_USR-..."
              data-testid="input-mp-access-token"
            />
            <p className="text-xs text-muted-foreground">
              ℹ️ Cole aqui o Access Token gerado no painel do Mercado Pago
            </p>
          </div>
          <div className="space-y-2">
            <Label>Public Key</Label>
            <Input
              value={mpConfig.public_key}
              onChange={(e) => setMpConfig({ ...mpConfig, public_key: e.target.value })}
              placeholder="APP_USR-..."
              data-testid="input-mp-public-key"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mp-webhook">Webhook URL</Label>
            <Input
              id="mp-webhook"
              value={mpConfig.webhook_url}
              onChange={(e) => setMpConfig({ ...mpConfig, webhook_url: e.target.value })}
              placeholder="https://seu-dominio.com/api/webhooks/mercadopago"
              data-testid="input-mp-webhook"
            />
            <p className="text-xs text-muted-foreground">
              ℹ️ URL onde o Mercado Pago enviará notificações de pagamento
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => saveMercadoPagoConfig.mutate()}
              disabled={saveMercadoPagoConfig.isPending}
              data-testid="button-save-mp-config"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saveMercadoPagoConfig.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Salvar Configuração
            </Button>
            <Button
              variant="outline"
              onClick={() => testMercadoPagoConnection.mutate()}
              disabled={testMercadoPagoConnection.isPending || !mpConfig.access_token}
              data-testid="button-test-mp-connection"
            >
              {testMercadoPagoConnection.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Testar Conexão
            </Button>
          </div>

          {mpConfigData && mpConfigData.webhook_url && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-900">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-green-700 dark:text-green-400">Webhook Configurado</p>
                  <p className="text-sm text-green-600 dark:text-green-300 mt-1 break-all">
                    {mpConfigData.webhook_url}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                    ✅ Configure esta URL no painel do Mercado Pago quando tiver seu domínio premium
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Componente de Promoções
function PromocoesTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [cupomDialogOpen, setCupomDialogOpen] = useState(false);
  const [editingCupom, setEditingCupom] = useState<any>(null);
  const [cupomForm, setCupomForm] = useState({
    codigo: "",
    tipo: "percentual",
    valor: 0,
    planos_aplicaveis: ["premium_mensal", "premium_anual"],
    data_inicio: new Date().toISOString().split('T')[0],
    data_expiracao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    quantidade_maxima: null as number | null,
    descricao: "",
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Buscar cupons
  const { data: cupons = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/cupons"],
    retry: 1,
  });

  // Mutation para criar/editar cupom
  const saveCupomMutation = useMutation({
    mutationFn: async () => {
      const endpoint = editingCupom ? `/api/cupons/${editingCupom.id}` : "/api/cupons";
      const method = editingCupom ? "PUT" : "POST";
      
      // Adicionar criado_por ao criar novo cupom
      const payload = {
        ...cupomForm,
        criado_por: user.id,
      };
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
          "x-is-admin": "true",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao salvar cupom");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: editingCupom ? "Cupom atualizado!" : "Cupom criado!",
        description: editingCupom 
          ? "O cupom foi atualizado com sucesso" 
          : "O novo cupom está disponível para uso",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cupons"] });
      setCupomDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation para deletar cupom
  const deleteCupomMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/cupons/${id}`, {
        method: "DELETE",
        headers: {
          "x-user-id": user.id,
          "x-is-admin": "true",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao deletar cupom");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Cupom deletado!",
        description: "O cupom foi removido com sucesso",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cupons"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setEditingCupom(null);
    setCupomForm({
      codigo: "",
      tipo: "percentual",
      valor: 0,
      planos_aplicaveis: ["premium_mensal", "premium_anual"],
      data_inicio: new Date().toISOString().split('T')[0],
      data_expiracao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      quantidade_maxima: null,
      descricao: "",
    });
  };

  const handleEdit = (cupom: any) => {
    setEditingCupom(cupom);
    setCupomForm({
      codigo: cupom.codigo,
      tipo: cupom.tipo,
      valor: cupom.valor,
      planos_aplicaveis: cupom.planos_aplicaveis || ["premium_mensal", "premium_anual"],
      data_inicio: cupom.data_inicio?.split('T')[0] || new Date().toISOString().split('T')[0],
      data_expiracao: cupom.data_expiracao?.split('T')[0] || new Date().toISOString().split('T')[0],
      quantidade_maxima: cupom.quantidade_maxima,
      descricao: cupom.descricao || "",
    });
    setCupomDialogOpen(true);
  };

  const cuponsAtivos = cupons.filter(c => c.status === 'ativo');
  const cuponsExpirados = cupons.filter(c => c.status === 'expirado');

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{cuponsAtivos.length}</p>
              <p className="text-sm text-muted-foreground">Cupons Ativos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {cupons.reduce((sum, c) => sum + (c.quantidade_utilizada || 0), 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total de Usos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{cupons.length}</p>
              <p className="text-sm text-muted-foreground">Total de Cupons</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Cupons */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Gerenciar Cupons de Desconto
            </CardTitle>
            <Button onClick={() => {
              resetForm();
              setCupomDialogOpen(true);
            }}>
              <DollarSign className="h-4 w-4 mr-2" />
              Novo Cupom
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
            </div>
          ) : cupons.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">Nenhum cupom criado ainda</p>
              <Button variant="outline" className="mt-4" onClick={() => setCupomDialogOpen(true)}>
                Criar primeiro cupom
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Planos</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Usos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cupons.map((cupom) => (
                  <TableRow key={cupom.id}>
                    <TableCell className="font-mono font-bold">{cupom.codigo}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {cupom.tipo === 'percentual' ? 'Percentual' : 'Valor Fixo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {cupom.tipo === 'percentual' ? `${cupom.valor}%` : `R$ ${cupom.valor.toFixed(2)}`}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {(cupom.planos_aplicaveis || ['todos']).map((plano: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {plano === 'premium_mensal' ? 'Mensal' : plano === 'premium_anual' ? 'Anual' : plano}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      {formatDate(cupom.data_inicio)} até {formatDate(cupom.data_expiracao)}
                    </TableCell>
                    <TableCell>
                      {cupom.quantidade_utilizada || 0}
                      {cupom.quantidade_maxima ? ` / ${cupom.quantidade_maxima}` : ' / ∞'}
                    </TableCell>
                    <TableCell>{getStatusBadge(cupom.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(cupom)}
                          title="Editar cupom"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={async () => {
                            const novoStatus = cupom.status === 'ativo' ? 'inativo' : 'ativo';
                            try {
                              const response = await fetch(`/api/cupons/${cupom.id}`, {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'x-user-id': user.id,
                                  'x-is-admin': 'true',
                                },
                                body: JSON.stringify({ status: novoStatus }),
                              });
                              
                              if (response.ok) {
                                toast({
                                  title: `Cupom ${novoStatus === 'ativo' ? 'ativado' : 'desativado'}`,
                                  description: `O cupom ${cupom.codigo} foi ${novoStatus === 'ativo' ? 'ativado' : 'desativado'}`,
                                });
                                queryClient.invalidateQueries({ queryKey: ["/api/cupons"] });
                              }
                            } catch (error) {
                              toast({
                                title: "Erro",
                                description: "Erro ao alterar status do cupom",
                                variant: "destructive",
                              });
                            }
                          }}
                          title={cupom.status === 'ativo' ? 'Desativar cupom' : 'Ativar cupom'}
                        >
                          {cupom.status === 'ativo' ? (
                            <Ban className="h-4 w-4 text-orange-500" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            if (confirm(`Deletar cupom ${cupom.codigo}?`)) {
                              deleteCupomMutation.mutate(cupom.id);
                            }
                          }}
                          title="Deletar cupom"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Criar/Editar Cupom */}
      <Dialog open={cupomDialogOpen} onOpenChange={setCupomDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingCupom ? 'Editar Cupom' : 'Criar Novo Cupom'}</DialogTitle>
            <DialogDescription>
              Configure os detalhes do cupom de desconto
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Código do Cupom *</Label>
                <Input
                  value={cupomForm.codigo}
                  onChange={(e) => setCupomForm({ ...cupomForm, codigo: e.target.value.toUpperCase() })}
                  placeholder="BLACKFRIDAY2025"
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo de Desconto</Label>
                <Select value={cupomForm.tipo} onValueChange={(value) => setCupomForm({ ...cupomForm, tipo: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentual">Percentual (%)</SelectItem>
                    <SelectItem value="valor_fixo">Valor Fixo (R$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Valor do Desconto *</Label>
              <Input
                type="number"
                step="0.01"
                value={cupomForm.valor}
                onChange={(e) => setCupomForm({ ...cupomForm, valor: parseFloat(e.target.value) })}
                placeholder={cupomForm.tipo === 'percentual' ? '10 (para 10%)' : '50 (para R$ 50,00)'}
              />
            </div>

            <div className="space-y-2">
              <Label>Planos Aplicáveis</Label>
              <div className="flex gap-2 flex-wrap">
                {['premium_mensal', 'premium_anual'].map(plano => (
                  <label key={plano} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cupomForm.planos_aplicaveis.includes(plano)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCupomForm({
                            ...cupomForm,
                            planos_aplicaveis: [...cupomForm.planos_aplicaveis, plano]
                          });
                        } else {
                          setCupomForm({
                            ...cupomForm,
                            planos_aplicaveis: cupomForm.planos_aplicaveis.filter(p => p !== plano)
                          });
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">
                      {plano === 'premium_mensal' ? 'Premium Mensal' : 'Premium Anual'}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Selecione os planos onde o cupom pode ser usado
              </p>
            </div>

            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={cupomForm.descricao}
                onChange={(e) => setCupomForm({ ...cupomForm, descricao: e.target.value })}
                placeholder="Black Friday - 20% de desconto em todos os planos"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data Início</Label>
                <Input
                  type="date"
                  value={cupomForm.data_inicio}
                  onChange={(e) => setCupomForm({ ...cupomForm, data_inicio: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Data Expiração</Label>
                <Input
                  type="date"
                  value={cupomForm.data_expiracao}
                  onChange={(e) => setCupomForm({ ...cupomForm, data_expiracao: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Quantidade Máxima de Usos</Label>
              <Input
                type="number"
                value={cupomForm.quantidade_maxima || ""}
                onChange={(e) => setCupomForm({ 
                  ...cupomForm, 
                  quantidade_maxima: e.target.value ? parseInt(e.target.value) : null 
                })}
                placeholder="Deixe vazio para ilimitado"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCupomDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                if (!cupomForm.codigo || !cupomForm.valor) {
                  toast({
                    title: "Campos obrigatórios",
                    description: "Código e valor são obrigatórios",
                    variant: "destructive",
                  });
                  return;
                }
                if (cupomForm.planos_aplicaveis.length === 0) {
                  toast({
                    title: "Planos obrigatórios",
                    description: "Selecione pelo menos um plano aplicável",
                    variant: "destructive",
                  });
                  return;
                }
                saveCupomMutation.mutate();
              }} 
              disabled={saveCupomMutation.isPending}
            >
              {saveCupomMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingCupom ? 'Salvar Alterações' : 'Criar Cupom'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Componente de Sistema
function SistemaTab({ users, subscriptions }: { users: User[], subscriptions: Subscription[] }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  const assinaturasAtivas = subscriptions.filter(s => s.status === "ativo").length;
  const assinaturasPendentes = subscriptions.filter(s => s.status === "pendente").length;
  const receitaMensal = subscriptions
    .filter(s => s.status === "ativo")
    .reduce((sum, s) => sum + s.valor, 0);

  // Buscar status de saúde do sistema
  const { data: healthStatus, isLoading: isLoadingHealth, refetch: fetchHealthStatus } = useQuery<HealthStatus>({
    queryKey: ["/api/system/health"],
    refetchInterval: 60000, // Atualizar a cada 1 minuto
  });

  // Buscar histórico de correções automáticas
  const { data: autoFixHistory } = useQuery<any[]>({
    queryKey: ["/api/system/autofix-history"],
    refetchInterval: 60000,
  });

  const runHealthCheck = async () => {
    setIsCheckingHealth(true);
    try {
      const response = await fetch("/api/system/health/check", {
        method: "POST",
        headers: {
          "x-user-id": JSON.parse(localStorage.getItem("user") || "{}").id,
          "x-is-admin": "true",
        },
      });

      if (response.ok) {
        toast({
          title: "Verificação concluída!",
          description: "Verificações de saúde executadas com sucesso",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/system/health"] });
        queryClient.invalidateQueries({ queryKey: ["/api/system/autofix-history"] });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao executar verificações",
        variant: "destructive",
      });
    } finally {
      setIsCheckingHealth(false);
    }
  };

  // Adjusting thresholds for system status based on the problem description
  const getSystemStatus = (checks: any[] | undefined) => {
    if (!checks) return 'degraded'; // Assume degraded if no checks data yet
    const criticalCount = checks.filter(check => check.status === 'critical').length;
    const degradedCount = checks.filter(check => check.status === 'degraded').length;

    // If there are critical issues, system is offline
    if (criticalCount > 0) return 'offline';
    // If there are degraded issues and no critical ones, system is degraded
    if (degradedCount > 0) return 'degraded';
    // Otherwise, system is online
    return 'online';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const systemStatus = getSystemStatus(healthStatus?.checks);

  return (
    <div className="space-y-6">
      {/* Status do Sistema com Auto-Healing */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              Status do Sistema
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={runHealthCheck}
                disabled={isCheckingHealth}
                data-testid="button-verify-health"
              >
                {isCheckingHealth ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Verificar Agora
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => window.open('/test-suite', '_blank')}
                className="bg-purple-600 hover:bg-purple-700"
                data-testid="button-run-tests"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Executar Testes
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Status Geral - Melhorado */}
            <div className={`flex items-center justify-between p-6 rounded-lg border-2 ${
              systemStatus === 'online' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-900' :
              systemStatus === 'degraded' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900' :
              'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-900'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${
                  systemStatus === 'online' ? 'bg-emerald-500' :
                  systemStatus === 'degraded' ? 'bg-amber-500' : 'bg-rose-500'
                }`}>
                  {systemStatus === 'online' ? (
                    <CheckCircle className="h-6 w-6 text-white" />
                  ) : systemStatus === 'degraded' ? (
                    <AlertCircle className="h-6 w-6 text-white" />
                  ) : (
                    <XCircle className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <p className="text-lg font-bold mb-1">
                    {systemStatus === 'online' ? 'Sistema Operacional' :
                     systemStatus === 'degraded' ? 'Sistema com Alertas' :
                     'Sistema com Problemas'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {healthStatus?.summary?.healthy || 0} serviços saudáveis, {healthStatus?.summary?.degraded || 0} com alertas, {healthStatus?.summary?.critical || 0} críticos
                  </p>
                  {healthStatus?.lastCheck && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Última verificação: {new Date(healthStatus.lastCheck).toLocaleString('pt-BR')}
                    </p>
                  )}
                </div>
              </div>
              <Badge className={`text-sm px-3 py-1 ${
                systemStatus === 'online' ? 'bg-emerald-500 hover:bg-emerald-600' :
                systemStatus === 'degraded' ? 'bg-amber-500 hover:bg-amber-600' :
                'bg-rose-500 hover:bg-rose-600'
              }`}>
                {systemStatus === 'online' ? 'Online' :
                 systemStatus === 'degraded' ? 'Degradado' : 'Offline'}
              </Badge>
            </div>

            {/* Auto-Healing Summary */}
            {healthStatus?.summary?.autoFixed && healthStatus.summary.autoFixed > 0 && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-full">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-blue-700 dark:text-blue-400">
                      🔧 Auto-Healing Ativo
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      {healthStatus.summary.autoFixed} problema(s) corrigido(s) automaticamente
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Verificações Detalhadas - Melhoradas */}
            {healthStatus?.checks && healthStatus.checks.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-base font-semibold">Verificações de Saúde:</p>
                  {healthStatus.summary?.degraded > 0 || healthStatus.summary?.critical > 0 ? (
                    <Button
                      size="sm"
                      variant="default"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={runHealthCheck}
                      disabled={isCheckingHealth}
                      data-testid="button-try-fix"
                    >
                      {isCheckingHealth ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Zap className="h-4 w-4 mr-2" />
                      )}
                      Tentar Corrigir
                    </Button>
                  ) : null}
                </div>
                <div className="grid gap-3">
                  {healthStatus.checks.map((check: any, index: number) => (
                    <div
                      key={index}
                      className={`flex items-start justify-between p-4 rounded-lg border-2 transition-all ${
                        check.status === 'healthy'
                          ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900'
                          : check.status === 'degraded'
                          ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900'
                          : 'bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-900'
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-0.5">
                          {getStatusIcon(check.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-base capitalize mb-1">
                            {check.service.replace(/_/g, ' ')}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">{check.message}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {check.autoFixed && (
                              <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200" variant="outline">
                                <Check className="h-3 w-3 mr-1" />
                                Corrigido Automaticamente
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {new Date(check.timestamp).toLocaleString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        {check.status !== 'healthy' && check.service === 'email_service' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Redirecionar para configurações
                              const sidebar = document.querySelector('aside');
                              const configButton = Array.from(sidebar?.querySelectorAll('button') || [])
                                .find(btn => btn.textContent?.includes('Configurações'));
                              if (configButton instanceof HTMLElement) {
                                configButton.click();
                                setTimeout(() => {
                                  const emailSection = document.getElementById('smtp-config');
                                  emailSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }, 200);
                              }
                            }}
                            className="whitespace-nowrap"
                            data-testid="button-configure-smtp"
                          >
                            <Settings className="h-4 w-4 mr-1" />
                            Configurar
                          </Button>
                        )}
                        {check.status !== 'healthy' && check.service === 'memory_usage' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              try {
                                await fetch('/api/system/health/check', {
                                  method: 'POST',
                                  headers: {
                                    "x-user-id": JSON.parse(localStorage.getItem("user") || "{}").id,
                                    "x-is-admin": "true",
                                  },
                                });
                                await fetchHealthStatus();
                                toast({
                                  title: "Memória liberada!",
                                  description: "Garbage collection executado com sucesso",
                                });
                              } catch (error) {
                                toast({
                                  title: "Erro",
                                  description: "Erro ao tentar liberar memória",
                                  variant: "destructive",
                                });
                              }
                            }}
                            className="whitespace-nowrap"
                            data-testid="button-free-memory"
                          >
                            <Zap className="h-4 w-4 mr-1" />
                            Liberar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Auto-Healing */}
      {autoFixHistory && autoFixHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Histórico de Correções Automáticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {autoFixHistory.slice(0, 10).map((fix: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">{fix.service.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-muted-foreground">{fix.message}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(fix.timestamp).toLocaleString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suite de Testes Automatizados */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100/30 dark:from-purple-950/20 dark:to-purple-900/10 border-purple-200/50 dark:border-purple-800/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Suite de Testes Automatizados
              </CardTitle>
              <CardDescription className="mt-2">
                Valide funcionalidades críticas do sistema: bloqueios, pacotes de funcionários, emails e webhooks
              </CardDescription>
            </div>
            <Button
              variant="default"
              onClick={() => window.open('/test-suite', '_blank')}
              className="bg-purple-600 hover:bg-purple-700"
              data-testid="button-open-test-suite"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Abrir Suite de Testes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold">Fluxo de Bloqueio</p>
                  <p className="text-xs text-muted-foreground">Usuários e funcionários</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-semibold">Pacotes de Funcionários</p>
                  <p className="text-xs text-muted-foreground">Compra e limites</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold">Sistema de Emails</p>
                  <p className="text-xs text-muted-foreground">Templates e SMTP</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <CreditCard className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="font-semibold">Webhooks Mercado Pago</p>
                  <p className="text-xs text-muted-foreground">Integração de pagamento</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

// Componente de Métricas (Placeholder - assumindo que ele existe em outro lugar)
function MetricsView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Exibindo métricas detalhadas aqui...</p>
        {/* Conteúdo real das métricas */}
      </CardContent>
    </Card>
  );
}


type Subscription = {
  id: number;
  user_id: string;
  plano: string;
  status: string;
  valor: number;
  data_inicio: string | null;
  data_vencimento: string | null;
  mercadopago_payment_id: string | null;
  forma_pagamento: string | null;
  status_pagamento: string | null;
  data_criacao: string;
  invoice_url?: string;
  init_point?: string;
  prazo_limite_pagamento?: string;
};

type User = {
  id: string;
  nome: string;
  email: string;
  plano: string;
  status: string;
  data_criacao: string | null;
  data_expiracao_trial: string | null;
  data_expiracao_plano: string | null;
  mercadopago_customer_id?: string;
  is_admin?: string | boolean;
  cpf_cnpj?: string;
  telefone?: string;
  endereco?: string;
  max_funcionarios?: number;
};

export default function AdminPublico() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClientFor360, setSelectedClientFor360] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'clientes' | 'assinaturas' | 'configuracoes' | 'sistema' | 'metricas' | 'logs' | 'promocoes'>('dashboard');
  const [configTab, setConfigTab] = useState<'config' | 'mercadopago'>('config');
  const [userEditDialogOpen, setUserEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [limparLogsDialogOpen, setLimparLogsDialogOpen] = useState(false);

  // Recupera o usuário logado do localStorage
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("user") || "{}") : {};

  // Mutation para limpar logs (deve estar no topo com os outros hooks)
  const limparLogsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/all-logs', {
        method: 'DELETE',
        headers: {
          'x-user-id': user?.id || '',
          'x-is-admin': 'true',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao limpar logs');
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/all-logs'] });
      toast({
        title: "✅ Logs limpos com sucesso",
        description: `${data.deletedCount} registro(s) removido(s)`,
      });
      setLimparLogsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao limpar logs",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { data: subscriptions = [], isLoading: isLoadingSubscriptions, error: subscriptionsError } = useQuery<Subscription[]>({
    queryKey: ["/api/subscriptions"],
    retry: 1,
    staleTime: 30000,
  });

  const { data: users = [], isLoading: isLoadingUsers, error: usersError } = useQuery<User[]>({
    queryKey: ["/api/users"],
    retry: 1,
    staleTime: 30000,
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest("DELETE", `/api/users/${userId}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Usuário excluído!",
        description: "O usuário foi removido com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Calcular métricas
  const assinaturasAtivas = subscriptions.filter(s => s.status === "ativo").length;
  const assinaturasPendentes = subscriptions.filter(s => s.status === "pendente").length;
  const receitaMensal = subscriptions
    .filter(s => s.status === "ativo")
    .reduce((sum, s) => sum + s.valor, 0);

  // Dados para gráficos
  const planDistributionData = useMemo(() => {
    const counts: Record<string, number> = {};
    users.forEach(user => {
      counts[user.plano] = (counts[user.plano] || 0) + 1;
    });

    const colors: Record<string, string> = {
      free: "#94a3b8",
      trial: "#60a5fa",
      mensal: "#3b82f6",
      premium_mensal: "#3b82f6",
      anual: "#10b981",
      premium_anual: "#10b981",
      premium: "#8b5cf6",
    };

    return Object.entries(counts).map(([plano, value]) => ({
      name: plano.charAt(0).toUpperCase() + plano.slice(1).replace('_', ' '),
      value,
      color: colors[plano] || "#facc15",
    }));
  }, [users]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string, color: string }> = {
      ativo: { variant: "default", label: "Ativo", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
      pendente: { variant: "secondary", label: "Pendente", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
      expirado: { variant: "destructive", label: "Expirado", color: "bg-red-500/10 text-red-400 border-red-500/20" },
      cancelado: { variant: "outline", label: "Cancelado", color: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
      inativo: { variant: "outline", label: "Inativo", color: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
      bloqueado: { variant: "destructive", label: "Bloqueado", color: "bg-red-500/10 text-red-400 border-red-500/20" },
    };
    const config = statusMap[status] || { variant: "outline" as const, label: status, color: "bg-gray-500/10 text-gray-400 border-gray-500/20" };
    return <Badge className={`${config.color} border`}>{config.label}</Badge>;
  };

  // Listener para abrir dialog de limpeza via evento - MUST be before conditional returns
  useEffect(() => {
    const handleOpenLimparLogs = () => {
      setLimparLogsDialogOpen(true);
    };

    window.addEventListener('open-limpar-logs', handleOpenLimparLogs);
    return () => window.removeEventListener('open-limpar-logs', handleOpenLimparLogs);
  }, []);

  const planosFreeCount = users.filter(u => u.plano === 'free' || u.plano === 'trial').length;

  const handleLimparLogs = () => {
    limparLogsMutation.mutate();
  };

  if (isLoadingSubscriptions || isLoadingUsers) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-slate-600 dark:text-slate-300 text-lg">Carregando painel...</p>
        </div>
      </div>
    );
  }

  if (subscriptionsError || usersError) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
              <h2 className="text-xl font-bold">Erro ao carregar dados</h2>
              <p className="text-sm text-muted-foreground">
                {subscriptionsError?.message || usersError?.message || "Erro desconhecido"}
              </p>
              <Button onClick={() => {
                queryClient.invalidateQueries({ queryKey: ["/api/subscriptions"] });
                queryClient.invalidateQueries({ queryKey: ["/api/users"] });
              }}>
                Tentar novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-800 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-slate-700">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-slate-700 w-full"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant="ghost"
            className={`w-full justify-start hover:bg-slate-700 ${!selectedClientFor360 && activeTab === 'dashboard' ? 'bg-slate-700' : ''}`}
            onClick={() => {
              setSelectedClientFor360(null);
              setActiveTab('dashboard');
            }}
          >
            <BarChart3 className="h-5 w-5 mr-3" />
            {sidebarOpen && "Dashboard"}
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start hover:bg-slate-700 ${!selectedClientFor360 && activeTab === 'clientes' ? 'bg-slate-700' : ''}`}
            onClick={() => {
              setSelectedClientFor360(null);
              setActiveTab('clientes');
            }}
          >
            <Users className="h-5 w-5 mr-3" />
            {sidebarOpen && "Clientes"}
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start hover:bg-slate-700 ${!selectedClientFor360 && activeTab === 'assinaturas' ? 'bg-slate-700' : ''}`}
            onClick={() => {
              setSelectedClientFor360(null);
              setActiveTab('assinaturas');
            }}
          >
            <CreditCard className="h-5 w-5 mr-3" />
            {sidebarOpen && "Assinaturas"}
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start hover:bg-slate-700 ${!selectedClientFor360 && activeTab === 'configuracoes' ? 'bg-slate-700' : ''}`}
            onClick={() => {
              setSelectedClientFor360(null);
              setActiveTab('configuracoes');
            }}
          >
            <Settings className="h-5 w-5 mr-3" />
            {sidebarOpen && "Configurações"}
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start hover:bg-slate-700 ${!selectedClientFor360 && activeTab === 'sistema' ? 'bg-slate-700' : ''}`}
            onClick={() => {
              setSelectedClientFor360(null);
              setActiveTab('sistema');
            }}
          >
            <Database className="h-5 w-5 mr-3" />
            {sidebarOpen && "Sistema"}
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start hover:bg-slate-700 ${!selectedClientFor360 && activeTab === 'metricas' ? 'bg-slate-700' : ''}`}
            onClick={() => {
              setSelectedClientFor360(null);
              setActiveTab('metricas');
            }}
          >
            <BarChart3 className="h-5 w-5 mr-3" />
            {sidebarOpen && "Métricas"}
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start hover:bg-slate-700 ${!selectedClientFor360 && activeTab === 'logs' ? 'bg-slate-700' : ''}`}
            onClick={() => {
              setSelectedClientFor360(null);
              setActiveTab('logs');
            }}
          >
            <FileText className="h-5 w-5 mr-3" />
            {sidebarOpen && "Logs Admin"}
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start hover:bg-slate-700 ${!selectedClientFor360 && activeTab === 'promocoes' ? 'bg-slate-700' : ''}`}
            onClick={() => {
              setSelectedClientFor360(null);
              setActiveTab('promocoes');
            }}
          >
            <DollarSign className="h-5 w-5 mr-3" />
            {sidebarOpen && "Promoções"}
          </Button>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-400 hover:bg-slate-700 hover:text-red-300"
            onClick={() => setLocation("/dashboard")}
          >
            <LogOut className="h-5 w-5 mr-3" />
            {sidebarOpen && "Sair"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {selectedClientFor360 ? 'Cliente 360°' : activeTab === 'logs' ? 'Logs de Administradores' : 'Painel Principal'}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Bem-vindo, Administrador Master
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                {assinaturasPendentes}
              </span>
            </Button>
            <Button
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ["/api/subscriptions"] });
                queryClient.invalidateQueries({ queryKey: ["/api/users"] });
                // Invalidate logs if the logs tab is active
                if (activeTab === 'logs') {
                  queryClient.invalidateQueries({ queryKey: ["/api/admin/logs"] });
                }
              }}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {selectedClientFor360 ? (
            // Cliente 360° View
            <div className="space-y-6">
              <Button variant="outline" onClick={() => setSelectedClientFor360(null)}>
                ← Voltar para Dashboard
              </Button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Timeline de Atividades</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Cliente360Timeline userId={selectedClientFor360} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notas Internas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Cliente360Notes userId={selectedClientFor360} />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Informações do Cliente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(() => {
                      const client = users.find(u => u.id === selectedClientFor360);
                      const clientSubscriptions = subscriptions.filter(s => s.user_id === selectedClientFor360);

                      if (!client) {
                        return <p className="col-span-4 text-sm text-muted-foreground">Cliente não encontrado</p>;
                      }

                      const dataExpiracao = client.data_expiracao_plano || client.data_expiracao_trial;
                      const diasRestantes = dataExpiracao 
                        ? Math.max(0, Math.ceil((new Date(dataExpiracao).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
                        : null;

                      return (
                        <>
                          <div>
                            <p className="text-sm text-muted-foreground">Plano Atual</p>
                            <p className="font-semibold">{client.plano || 'Free'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge variant={client.status === 'ativo' ? 'default' : 'secondary'}>
                              {client.status || 'Desconhecido'}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Assinaturas</p>
                            <p className="font-semibold">{clientSubscriptions.length}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Data Cadastro</p>
                            <p className="font-semibold">
                              {client.data_criacao
                                ? formatDate(client.data_criacao)
                                : '-'}
                            </p>
                          </div>
                          {dataExpiracao && (
                            <>
                              <div>
                                <p className="text-sm text-muted-foreground">Expira em</p>
                                <p className="font-semibold">{formatDate(dataExpiracao)}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Dias Restantes</p>
                                <p className={`font-semibold ${diasRestantes && diasRestantes <= 7 ? 'text-red-600' : 'text-green-600'}`}>
                                  {diasRestantes} dias
                                </p>
                              </div>
                            </>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : activeTab === 'clientes' ? (
            // Aba de Clientes
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      Gerenciar Clientes
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Buscar clientes..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Button onClick={() => {
                        setEditingUser(null);
                        setUserEditDialogOpen(true);
                      }}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Novo Usuário
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Plano</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data Cadastro</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users && users.length > 0 ? (
                        users
                          .filter(user =>
                            (user.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                            (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
                          )
                          .map((user) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">{user.nome || '-'}</TableCell>
                              <TableCell>{user.email || '-'}</TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {user.plano === "trial" && "Trial"}
                                  {user.plano === "free" && "Free"}
                                  {user.plano === "premium_mensal" && "Premium Mensal"}
                                  {user.plano === "premium_anual" && "Premium Anual"}
                                  {!["trial", "free", "premium_mensal", "premium_anual"].includes(user.plano) && "Free"}
                                </Badge>
                              </TableCell>
                              <TableCell>{getStatusBadge(user.status || 'expirado')}</TableCell>
                              <TableCell>{formatDate(user.data_criacao)}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedClientFor360(user.id)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setEditingUser(user);
                                      setUserEditDialogOpen(true);
                                    }}
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      if (confirm(`Tem certeza que deseja excluir o usuário ${user.nome}?`)) {
                                        deleteUserMutation.mutate(user.id);
                                      }
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground">
                            Nenhum cliente encontrado
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          ) : activeTab === 'assinaturas' ? (
            // Aba de Assinaturas
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    Gerenciar Assinaturas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Plano</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscriptions && subscriptions.length > 0 ? (
                        subscriptions.map((sub) => {
                          const user = users.find(u => u.id === sub.user_id);
                          return (
                            <TableRow key={sub.id}>
                              <TableCell className="font-medium">{user?.nome || user?.email || '-'}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{sub.plano}</Badge>
                              </TableCell>
                              <TableCell>{formatCurrency(sub.valor)}</TableCell>
                              <TableCell>{getStatusBadge(sub.status)}</TableCell>
                              <TableCell>{formatDate(sub.data_vencimento)}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedClientFor360(sub.user_id)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver Cliente
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground">
                            Nenhuma assinatura encontrada
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          ) : activeTab === 'configuracoes' ? (
            // Aba de Configurações - Apenas Mercado Pago
            <div className="space-y-6">
              <MercadoPagoConfigTab />
            </div>
          ) : activeTab === 'sistema' ? (
            // Aba de Sistema
            <SistemaTab users={users} subscriptions={subscriptions} />
          ) : activeTab === 'metricas' ? (
            // Aba de Métricas
            <div className="space-y-6">
              {/* Estatísticas Gerais */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Total de Usuários</p>
                      <p className="text-3xl font-bold">{users.length}</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        +12% desde a semana passada
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Total de Assinaturas</p>
                      <p className="text-3xl font-bold">{subscriptions.length}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Assinaturas Ativas</p>
                      <p className="text-3xl font-bold text-green-600">{assinaturasAtivas}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Receita Mensal</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(receitaMensal)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Métricas Detalhadas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Métricas do Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
                      <div>
                        <p className="font-semibold text-orange-900 dark:text-orange-100">Assinaturas Pendentes</p>
                        <p className="text-xs text-orange-700 dark:text-orange-300">Aguardando pagamento</p>
                      </div>
                      <Badge variant="secondary" className="text-lg">{assinaturasPendentes}</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
                      <div>
                        <p className="font-semibold text-blue-900 dark:text-blue-100">Taxa de Conversão</p>
                        <p className="text-xs text-blue-700 dark:text-blue-300">Assinaturas ativas / total</p>
                      </div>
                      <Badge className="text-lg">
                        {subscriptions.length > 0
                          ? ((assinaturasAtivas / subscriptions.length) * 100).toFixed(1)
                          : '0.0'}%
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
                      <div>
                        <p className="font-semibold text-purple-900 dark:text-purple-100">Planos Free/Trial</p>
                        <p className="text-xs text-purple-700 dark:text-purple-300">Usuários no plano gratuito</p>
                      </div>
                      <Badge variant="secondary" className="text-lg">{planosFreeCount}</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
                      <div>
                        <p className="font-semibold text-green-900 dark:text-green-100">Ticket Médio</p>
                        <p className="text-xs text-green-700 dark:text-green-300">Receita por assinatura</p>
                      </div>
                      <Badge className="text-lg bg-green-600">
                        {assinaturasAtivas > 0
                          ? formatCurrency(receitaMensal / assinaturasAtivas)
                          : 'R$ 0,00'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20">
                      <div>
                        <p className="font-semibold text-red-900 dark:text-red-100">Contas Bloqueadas</p>
                        <p className="text-xs text-red-700 dark:text-red-300">Por falta de pagamento</p>
                      </div>
                      <Badge variant="destructive" className="text-lg">
                        {users.filter(u => u.status === 'bloqueado').length}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/20 dark:to-indigo-900/20">
                      <div>
                        <p className="font-semibold text-indigo-900 dark:text-indigo-100">Cadastros Hoje</p>
                        <p className="text-xs text-indigo-700 dark:text-indigo-300">Novos usuários</p>
                      </div>
                      <Badge variant="secondary" className="text-lg">
                        {users.filter(u => {
                          const today = new Date().toDateString();
                          return new Date(u.data_criacao || '').toDateString() === today;
                        }).length}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : activeTab === 'logs' ? (
            // Aba de Logs de Administrador
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Logs de Administradores
                    </CardTitle>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setLimparLogsDialogOpen(true)}
                      data-testid="button-clear-logs"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Limpar Todos os Logs
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <AdminLogsView isPublicAdmin={true} />
                </CardContent>
              </Card>

              {/* Dialog de Confirmação para Limpar Logs */}
              <Dialog open={limparLogsDialogOpen} onOpenChange={setLimparLogsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Confirmar Limpeza de Logs</DialogTitle>
                    <DialogDescription>
                      Tem certeza que deseja remover todos os registros de logs? Esta ação não pode ser desfeita.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setLimparLogsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button variant="destructive" onClick={handleLimparLogs} disabled={limparLogsMutation.isPending}>
                      {limparLogsMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Limpar Logs
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : activeTab === 'promocoes' ? (
            // Aba de Promoções e Descontos - SISTEMA ATIVO
            <PromocoesTab />
          ) : (
            // Dashboard Principal
            <>
              {/* Cards de Métricas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total Usuários</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{users.length}</p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          +12% desde a semana passada
                        </p>
                      </div>
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">MRR (Receita Mensal)</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(receitaMensal)}</p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          +8.5% este mês
                        </p>
                      </div>
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Assinaturas Ativas</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{assinaturasAtivas}</p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          Taxa de conversão: {subscriptions.length > 0 ? ((assinaturasAtivas / subscriptions.length) * 100).toFixed(1) : 0}%
                        </p>
                      </div>
                      <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                        <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Pendentes</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{assinaturasPendentes}</p>
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                          Aguardando pagamento
                        </p>
                      </div>
                      <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                        <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Gráficos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      Distribuição de Planos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={{}} className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={planDistributionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {planDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Crescimento Mensal
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={{}} className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { month: 'Jan', users: 45, revenue: 3500 },
                          { month: 'Fev', users: 52, revenue: 4200 },
                          { month: 'Mar', users: 61, revenue: 4800 },
                          { month: 'Abr', users: 70, revenue: 5500 },
                          { month: 'Mai', users: 85, revenue: 6800 },
                          { month: 'Jun', users: users.length, revenue: receitaMensal },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Area type="monotone" dataKey="users" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Tabela de Clientes */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      Clientes Recentes
                    </CardTitle>
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Buscar clientes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Plano</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users && users.length > 0 ? (
                        users
                          .filter(user =>
                            (user.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                            (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
                          )
                          .slice(0, 10)
                          .map((user) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">{user.nome || '-'}</TableCell>
                              <TableCell>{user.email || '-'}</TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {user.plano === "trial" && "Trial"}
                                  {user.plano === "free" && "Free"}
                                  {user.plano === "premium_mensal" && "Premium Mensal"}
                                  {user.plano === "premium_anual" && "Premium Anual"}
                                  {!["trial", "free", "premium_mensal", "premium_anual"].includes(user.plano) && "Free"}
                                </Badge>
                              </TableCell>
                              <TableCell>{getStatusBadge(user.status || 'expirado')}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedClientFor360(user.id)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver Detalhes
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground">
                            Nenhum cliente encontrado
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </main>
      </div>

      {/* Dialog de Edição/Criação de Usuário */}
      <UserEditDialog
        user={editingUser}
        open={userEditDialogOpen}
        onOpenChange={setUserEditDialogOpen}
      />
    </div>
  );
}