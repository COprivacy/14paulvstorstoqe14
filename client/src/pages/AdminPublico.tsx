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
  Check,
  Crown,
  Package,
  Info,
  Building2 // Keep Building2 import, as it might be used elsewhere, though not in this file context anymore.
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
import { PlanExpirationCountdown } from "@/components/PlanExpirationCountdown";
import { updatePlanPricesCache, clearPlanPricesCache, fetchPlanPricesFromServer } from "@/lib/planPrices";

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

  // Estados para gerenciamento de pacotes de funcionários
  const [pacotesDialogOpen, setPacotesDialogOpen] = useState(false);
  const [pacotesConfig, setPacotesConfig] = useState({
    pacote_5: 49.99,
    pacote_10: 89.99,
    pacote_20: 159.99,
    pacote_50: 349.99,
  });

  // Função helper para formatar datas
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  // Função helper para exibir badge de status
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      ativo: { variant: 'default', label: 'Ativo' },
      inativo: { variant: 'secondary', label: 'Inativo' },
      expirado: { variant: 'destructive', label: 'Expirado' },
    };

    const config = statusConfig[status] || { variant: 'outline', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

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

  // Estado para gerenciar preços dos planos
  const [editandoPrecos, setEditandoPrecos] = useState(false);
  const [precos, setPrecos] = useState({
    premium_mensal: 79.99,
    premium_anual: 767.04
  });

  // Mutation para salvar preços
  const salvarPrecosMutation = useMutation({
    mutationFn: async () => {
      // Validar valores antes de enviar
      if (!precos.premium_mensal || precos.premium_mensal <= 0) {
        throw new Error('Preço mensal inválido');
      }
      if (!precos.premium_anual || precos.premium_anual <= 0) {
        throw new Error('Preço anual inválido');
      }

      console.log('💰 [MUTATION] Salvando preços:', precos);

      // Limpar cache antes de salvar
      clearPlanPricesCache();

      const response = await fetch('/api/plan-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
          'x-is-admin': 'true',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({
          premium_mensal: Number(precos.premium_mensal),
          premium_anual: Number(precos.premium_anual),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ [MUTATION] Erro ao salvar:', error);
        throw new Error(error.error || 'Erro ao salvar preços');
      }

      const data = await response.json();
      console.log('✅ [MUTATION] Resposta do servidor:', data);

      if (data.success && data.precos) {
        // Forçar atualização do cache
        updatePlanPricesCache(data.precos);

        // Buscar novamente do servidor para garantir sincronia
        await fetchPlanPricesFromServer();

        return data.precos;
      }

      throw new Error('Resposta inválida do servidor');
    },
    onSuccess: async (data) => {
      console.log('✅ [MUTATION] onSuccess:', data);

      // Atualizar estado local imediatamente
      if (data.precos) {
        setPrecos(data.precos);
      }

      toast({
        title: "✅ Preços atualizados!",
        description: "Os valores dos planos foram atualizados com sucesso em todo o sistema",
      });

      setEditandoPrecos(false);

      // Invalidar todas as queries relacionadas
      await queryClient.invalidateQueries({ queryKey: ['/api/plan-prices'] });
      await queryClient.refetchQueries({ queryKey: ['/api/plan-prices'] });

      // Forçar recarga da página após 500ms para garantir que tudo está atualizado
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    onError: (error: Error) => {
      console.error('❌ [MUTATION] onError:', error);
      toast({
        title: "Erro ao salvar preços",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation para salvar preços de pacotes de funcionários
  const salvarPacotesMutation = useMutation({
    mutationFn: async () => {
      // Validar valores antes de enviar
      const valores = [
        pacotesConfig.pacote_5,
        pacotesConfig.pacote_10,
        pacotesConfig.pacote_20,
        pacotesConfig.pacote_50
      ];

      for (const valor of valores) {
        if (!valor || valor <= 0) {
          throw new Error('Todos os preços devem ser maiores que zero');
        }
      }

      console.log('👥 Salvando pacotes:', pacotesConfig);

      const response = await fetch('/api/employee-package-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
          'x-is-admin': 'true',
        },
        body: JSON.stringify({
          pacote_5: Number(pacotesConfig.pacote_5),
          pacote_10: Number(pacotesConfig.pacote_10),
          pacote_20: Number(pacotesConfig.pacote_20),
          pacote_50: Number(pacotesConfig.pacote_50),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Erro ao salvar pacotes:', error);
        throw new Error(error.error || 'Erro ao salvar preços dos pacotes');
      }

      const result = await response.json();
      console.log('✅ Pacotes salvos:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('✅ Mutation onSuccess (pacotes):', data);
      toast({
        title: "✅ Preços dos pacotes atualizados!",
        description: "Os valores dos pacotes de funcionários foram atualizados com sucesso",
      });
      setPacotesDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/employee-package-prices'] });
    },
    onError: (error: Error) => {
      console.error('❌ Mutation onError (pacotes):', error);
      toast({
        title: "Erro ao salvar pacotes",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Carregar preços do backend ao montar o componente e quando a mutation for bem-sucedida
  useEffect(() => {
    const carregarPrecos = async () => {
      try {
        console.log('🔄 [FRONTEND] Carregando preços...');

        const response = await fetch('/api/plan-prices', {
          headers: {
            'Accept': 'application/json',
          },
          cache: 'no-store' // Forçar busca sem cache
        });

        console.log('📋 [FRONTEND] Response status:', response.status);
        console.log('📋 [FRONTEND] Content-Type:', response.headers.get('content-type'));

        if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
          const data = await response.json();

          console.log('📋 [FRONTEND] Dados recebidos:', data);

          // Validar que os dados são válidos
          if (data && typeof data.premium_mensal === 'number' && typeof data.premium_anual === 'number') {
            console.log('✅ [FRONTEND] Atualizando preços no estado:', data);
            setPrecos(data);
          } else {
            console.warn('⚠️ [FRONTEND] Dados inválidos, usando padrão');
            setPrecos({ premium_mensal: 79.99, premium_anual: 767.04 });
          }
        } else {
          console.warn('⚠️ [FRONTEND] Response inválida, usando padrão');
          setPrecos({ premium_mensal: 79.99, premium_anual: 767.04 });
        }
      } catch (error) {
        console.error('❌ [FRONTEND] Erro ao carregar preços:', error);
        setPrecos({ premium_mensal: 79.99, premium_anual: 767.04 });
      }
    };
    carregarPrecos();
  }, [salvarPrecosMutation.isSuccess]); // Adicionar dependência para recarregar após salvar

  // Carregar preços dos pacotes de funcionários
  useEffect(() => {
    const carregarPacotes = async () => {
      try {
        const response = await fetch('/api/employee-package-prices', {
          headers: {
            'Accept': 'application/json',
          }
        });

        if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
          const data = await response.json();
          if (data && Object.keys(data).length > 0) {
            setPacotesConfig(data);
          }
        }
      } catch (error) {
        // Silenciar o erro e usar preços padrão
      }
    };
    carregarPacotes();
  }, []);

  return (
    <div className="space-y-6">
      {/* Gerenciamento de Preços dos Planos */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              Preços dos Planos
            </CardTitle>
            {!editandoPrecos ? (
              <Button onClick={() => setEditandoPrecos(true)} variant="outline">
                <Edit2 className="h-4 w-4 mr-2" />
                Editar Preços
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setEditandoPrecos(false);
                    const precosSalvos = localStorage.getItem('planos_precos');
                    if (precosSalvos) {
                      setPrecos(JSON.parse(precosSalvos));
                    } else {
                      setPrecos({ premium_mensal: 79.99, premium_anual: 767.04 });
                    }
                  }}
                  variant="outline"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    if (!precos.premium_mensal || !precos.premium_anual) {
                      toast({
                        title: "Erro",
                        description: "Preencha todos os campos",
                        variant: "destructive",
                      });
                      return;
                    }
                    if (precos.premium_mensal <= 0 || precos.premium_anual <= 0) {
                      toast({
                        title: "Erro",
                        description: "Os preços devem ser maiores que zero",
                        variant: "destructive",
                      });
                      return;
                    }
                    console.log('🚀 Iniciando salvamento de preços...');
                    salvarPrecosMutation.mutate();
                  }}
                  disabled={salvarPrecosMutation.isPending}
                >
                  {salvarPrecosMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Salvar
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">Premium Mensal</h3>
                  </div>
                  {editandoPrecos ? (
                    <div className="space-y-2">
                      <Label>Valor Mensal (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={precos.premium_mensal}
                        onChange={(e) => setPrecos({ ...precos, premium_mensal: parseFloat(e.target.value) })}
                      />
                    </div>
                  ) : (
                    <p className="text-3xl font-bold text-blue-600">
                      R$ {precos.premium_mensal.toFixed(2)}<span className="text-sm text-gray-500">/mês</span>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-2 border-purple-200">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold">Premium Anual</h3>
                    <Badge variant="secondary" className="text-xs">Mais Popular</Badge>
                  </div>
                  {editandoPrecos ? (
                    <div className="space-y-2">
                      <Label>Valor Anual (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={precos.premium_anual}
                        onChange={(e) => setPrecos({ ...precos, premium_anual: parseFloat(e.target.value) })}
                      />
                      <p className="text-xs text-gray-500">
                        Mensal: R$ {(precos.premium_anual / 12).toFixed(2)}/mês
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-3xl font-bold text-purple-600">
                        R$ {(precos.premium_anual / 12).toFixed(2)}<span className="text-sm text-gray-500">/mês</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Total anual: R$ {precos.premium_anual.toFixed(2)}
                      </p>
                      <p className="text-xs text-green-600">
                        Economize R$ {((precos.premium_mensal * 12) - precos.premium_anual).toFixed(2)} por ano
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Gerenciamento de Pacotes de Funcionários */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Preços dos Pacotes de Funcionários
            </CardTitle>
            <Button onClick={() => setPacotesDialogOpen(true)} variant="outline">
              <Edit2 className="h-4 w-4 mr-2" />
              Editar Pacotes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="pt-6">
                <div className="space-y-2 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <h3 className="font-semibold text-sm">+5 Funcionários</h3>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    R$ {pacotesConfig.pacote_5.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">Pagamento único</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-2 border-purple-200">
              <CardContent className="pt-6">
                <div className="space-y-2 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <h3 className="font-semibold text-sm">+10 Funcionários</h3>
                  </div>
                  <Badge variant="secondary" className="text-xs mb-2">Mais Popular</Badge>
                  <p className="text-2xl font-bold text-purple-600">
                    R$ {pacotesConfig.pacote_10.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">Pagamento único</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="pt-6">
                <div className="space-y-2 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <h3 className="font-semibold text-sm">+20 Funcionários</h3>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    R$ {pacotesConfig.pacote_20.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">Pagamento único</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="pt-6">
                <div className="space-y-2 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-orange-600" />
                    <h3 className="font-semibold text-sm">+50 Funcionários</h3>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">
                    R$ {pacotesConfig.pacote_50.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">Pagamento único</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            ℹ️ Estes valores são exibidos para os usuários quando eles tentam adicionar mais funcionários
          </p>
        </CardContent>
      </Card>

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

      {/* Dialog de Editar Pacotes de Funcionários */}
      <Dialog open={pacotesDialogOpen} onOpenChange={setPacotesDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Preços dos Pacotes de Funcionários</DialogTitle>
            <DialogDescription>
              Configure os valores que serão exibidos para os usuários ao comprar pacotes adicionais de funcionários
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pacote +5 Funcionários</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">R$</span>
                  <Input
                    type="number"
                    step="0.01"
                    value={pacotesConfig.pacote_5}
                    onChange={(e) => setPacotesConfig({ ...pacotesConfig, pacote_5: parseFloat(e.target.value) })}
                    placeholder="49.99"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Pacote +10 Funcionários</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">R$</span>
                  <Input
                    type="number"
                    step="0.01"
                    value={pacotesConfig.pacote_10}
                    onChange={(e) => setPacotesConfig({ ...pacotesConfig, pacote_10: parseFloat(e.target.value) })}
                    placeholder="89.99"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pacote +20 Funcionários</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">R$</span>
                  <Input
                    type="number"
                    step="0.01"
                    value={pacotesConfig.pacote_20}
                    onChange={(e) => setPacotesConfig({ ...pacotesConfig, pacote_20: parseFloat(e.target.value) })}
                    placeholder="159.99"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Pacote +50 Funcionários</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">R$</span>
                  <Input
                    type="number"
                    step="0.01"
                    value={pacotesConfig.pacote_50}
                    onChange={(e) => setPacotesConfig({ ...pacotesConfig, pacote_50: parseFloat(e.target.value) })}
                    placeholder="349.99"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 <strong>Dica:</strong> Estes valores serão exibidos imediatamente para todos os usuários no dialog de compra de funcionários.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPacotesDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => salvarPacotesMutation.mutate()}
              disabled={salvarPacotesMutation.isPending}
            >
              {salvarPacotesMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Salvar Alterações
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

// Helper function para obter nome do pacote
const getPackageName = (packageType: string): string => {
  const packageNames: Record<string, string> = {
    pacote_5: "+5 Funcionários",
    pacote_10: "+10 Funcionários",
    pacote_20: "+20 Funcionários",
    pacote_50: "+50 Funcionários",
  };
  return packageNames[packageType] || packageType;
};

export default function AdminPublico() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClientFor360, setSelectedClientFor360] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'clientes' | 'assinaturas' | 'assinaturas_funcionarios' | 'configuracoes' | 'sistema' | 'metricas' | 'logs' | 'promocoes'>('dashboard');
  const [configTab, setConfigTab] = useState<'config' | 'mercadopago'>('mercadopago');
  const [userEditDialogOpen, setUserEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [limparLogsDialogOpen, setLimparLogsDialogOpen] = useState(false);

  // Estados para assinaturas
  const [subscriptionFilterStatus, setSubscriptionFilterStatus] = useState<string>("todos");
  const [subscriptionReprocessDialogOpen, setSubscriptionReprocessDialogOpen] = useState(false);
  const [subscriptionReprocessPaymentId, setSubscriptionReprocessPaymentId] = useState("");
  const [subscriptionDetailsDialogOpen, setSubscriptionDetailsDialogOpen] = useState(false);
  const [subscriptionPaymentDetails, setSubscriptionPaymentDetails] = useState<any>(null);

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

      // Disparar evento para o AdminLogsView recarregar
      window.dispatchEvent(new CustomEvent('logs-cleared'));

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

  // Mutation para reprocessar webhook de assinatura
  const subscriptionReprocessMutation = useMutation({
    mutationFn: async (paymentId: string) => {
      const response = await apiRequest("POST", "/api/admin/subscriptions/reprocess-webhook", {
        paymentId,
        gateway: 'mercadopago',
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ 
        title: "✅ Sucesso!", 
        description: "Webhook reprocessado com sucesso!" 
      });
      queryClient.invalidateQueries({ queryKey: ["/api/subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setSubscriptionReprocessDialogOpen(false);
      setSubscriptionReprocessPaymentId("");
    },
    onError: (error: Error) => {
      toast({ 
        title: "❌ Erro", 
        description: error.message || "Erro ao reprocessar webhook",
        variant: "destructive"
      });
    },
  });

  // Mutation para cancelar assinatura
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async (subscriptionId: number) => {
      const response = await fetch(`/api/admin/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || '',
          'x-is-admin': 'true',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao cancelar assinatura');
      }

      return response.json();
    },
    onSuccess: (data) => {
      const detalhes = data.detalhes || {};
      toast({
        title: "✅ Assinatura cancelada!",
        description: `Usuário bloqueado, ${detalhes.funcionariosBloqueados || 0} funcionário(s) bloqueado(s), pacotes cancelados e email enviado.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Erro ao cancelar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handler para cancelar com confirmação
  const handleCancelSubscription = (subscription: any) => {
    if (confirm(
      `⚠️ ATENÇÃO: Cancelamento Imediato\n\n` +
      `Ao cancelar esta assinatura:\n\n` +
      `✓ O usuário será BLOQUEADO IMEDIATAMENTE\n` +
      `✓ Plano será revertido para FREE\n` +
      `✓ TODOS os funcionários serão bloqueados\n` +
      `✓ Pacotes de funcionários serão cancelados\n` +
      `✓ Limite de funcionários será revertido para 1\n` +
      `✓ Email de notificação será enviado\n\n` +
      `Usuário: ${subscription.user_id}\n` +
      `Plano: ${subscription.plano}\n\n` +
      `Deseja continuar?`
    )) {
      cancelSubscriptionMutation.mutate(subscription.id);
    }
  };

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

  const { data: employeePackages = [], isLoading: loadingPackages } = useQuery<any[]>({
    queryKey: ["/api/admin/employee-packages"],
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

  const handleReprocessSubscription = () => {
    if (!subscriptionReprocessPaymentId) {
      toast({ 
        title: "Erro", 
        description: "Digite o Payment ID", 
        variant: "destructive" 
      });
      return;
    }

    subscriptionReprocessMutation.mutate(subscriptionReprocessPaymentId);
  };

  const handleViewSubscriptionDetails = async (paymentId: string) => {
    try {
      const res = await fetch(`/api/admin/subscriptions/payment-details/${paymentId}?gateway=mercadopago`, {
        headers: {
          "x-user-id": user?.id || "",
          "x-is-admin": "true",
        },
      });

      if (!res.ok) {
        throw new Error("Erro ao buscar detalhes do pagamento");
      }

      const data = await res.json();
      setSubscriptionPaymentDetails(data.payment);
      setSubscriptionDetailsDialogOpen(true);
    } catch (error: any) {
      toast({ 
        title: "Erro", 
        description: error.message,
        variant: "destructive"
      });
    }
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
            className={`w-full justify-start hover:bg-slate-700 ${!selectedClientFor360 && activeTab === 'assinaturas_funcionarios' ? 'bg-slate-700' : ''}`}
            onClick={() => {
              setSelectedClientFor360(null);
              setActiveTab('assinaturas_funcionarios');
            }}
          >
            <Package className="h-5 w-5 mr-3" />
            {sidebarOpen && "Assinaturas Func."}
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
                  <CardTitle>Contagem Regressiva do Plano</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const cliente = users.find(u => u.id === selectedClientFor360);
                    if (!cliente) return <p>Cliente não encontrado</p>;

                    return (
                      <PlanExpirationCountdown
                        expirationDate={cliente.data_expiracao_plano || cliente.data_expiracao_trial}
                        planName={cliente.plano === "trial" ? "Trial" : cliente.plano === "premium_mensal" ? "Premium Mensal" : cliente.plano === "premium_anual" ? "Premium Anual" : "Free"}
                        status={cliente.status || "ativo"}
                      />
                    );
                  })()}
                </CardContent>
              </Card>

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
              {/* Alerta de Ajuda */}
              <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div className="space-y-1">
                      <CardTitle className="text-base text-blue-900 dark:text-blue-100">
                        Gerenciamento de Assinaturas
                      </CardTitle>
                      <CardDescription className="text-sm text-blue-700 dark:text-blue-300">
                        <ul className="list-disc list-inside space-y-1 mt-2">
                          <li><strong>Reprocessar Webhook:</strong> Forçar processamento de pagamentos aprovados</li>
                          <li><strong>Ver Detalhes:</strong> Clique no Payment ID para ver status no gateway</li>
                          <li><strong>Ver Cliente:</strong> Acesse a visão 360° do cliente</li>
                        </ul>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Cards de Estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{assinaturasAtivas}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Em Processamento</CardTitle>
                    <Clock className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{assinaturasPendentes}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(receitaMensal)}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Assinaturas</CardTitle>
                    <CreditCard className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{subscriptions.length}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Filtros e Busca */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Filtros</CardTitle>
                    <div className="flex gap-2">
                      {subscriptions.filter(s => s.status === 'cancelado').length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={async () => {
                            const canceladas = subscriptions.filter(s => s.status === 'cancelado');
                            if (confirm(`Tem certeza que deseja remover ${canceladas.length} assinatura(s) cancelada(s) do histórico?`)) {
                              try {
                                for (const sub of canceladas) {
                                  await apiRequest("DELETE", `/api/subscriptions/${sub.id}`);
                                }
                                toast({
                                  title: "Limpeza concluída",
                                  description: `${canceladas.length} assinatura(s) cancelada(s) removida(s)`,
                                });
                                queryClient.invalidateQueries({ queryKey: ["/api/subscriptions"] });
                              } catch (error) {
                                toast({
                                  title: "Erro ao limpar",
                                  description: "Não foi possível remover todas as assinaturas",
                                  variant: "destructive",
                                });
                              }
                            }
                          }}
                          data-testid="button-clean-cancelled"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Limpar Canceladas ({subscriptions.filter(s => s.status === 'cancelado').length})
                        </Button>
                      )}
                      {subscriptions.filter(s => 
                        s.status === 'pendente' && 
                        s.prazo_limite_pagamento && 
                        new Date(s.prazo_limite_pagamento) < new Date()
                      ).length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-orange-600 hover:text-orange-700"
                          onClick={async () => {
                            const expiradas = subscriptions.filter(s => 
                              s.status === 'pendente' && 
                              s.prazo_limite_pagamento && 
                              new Date(s.prazo_limite_pagamento) < new Date()
                            );
                            if (confirm(`Tem certeza que deseja cancelar ${expiradas.length} assinatura(s) pendente(s) com prazo expirado?`)) {
                              try {
                                for (const sub of expiradas) {
                                  await apiRequest("PATCH", `/api/subscriptions/${sub.id}/status`, { 
                                    status: 'cancelado',
                                    motivo: 'Cancelado manualmente - prazo de pagamento expirado'
                                  });
                                }
                                toast({
                                  title: "Assinaturas canceladas",
                                  description: `${expiradas.length} assinatura(s) pendente(s) expirada(s) cancelada(s)`,
                                });
                                queryClient.invalidateQueries({ queryKey: ["/api/subscriptions"] });
                              } catch (error) {
                                toast({
                                  title: "Erro ao cancelar",
                                  description: "Não foi possível cancelar todas as assinaturas",
                                  variant: "destructive",
                                });
                              }
                            }
                          }}
                          data-testid="button-cancel-expired-pending"
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Cancelar Expiradas ({subscriptions.filter(s => 
                            s.status === 'pendente' && 
                            s.prazo_limite_pagamento && 
                            new Date(s.prazo_limite_pagamento) < new Date()
                          ).length})
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <Label>Buscar</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Nome, email ou payment ID..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9"
                          data-testid="input-search-subscriptions"
                        />
                      </div>
                    </div>

                    <div className="w-[200px]">
                      <Label>Status</Label>
                      <Select 
                        value={subscriptionFilterStatus} 
                        onValueChange={setSubscriptionFilterStatus}
                      >
                        <SelectTrigger data-testid="select-filter-status-subscriptions">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos</SelectItem>
                          <SelectItem value="ativo">Ativos</SelectItem>
                          <SelectItem value="pendente">Pendentes</SelectItem>
                          <SelectItem value="cancelado">Cancelados</SelectItem>
                          <SelectItem value="expirado">Expirados</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabela de Assinaturas */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-purple-600" />
                        Histórico Completo de Assinaturas
                      </CardTitle>
                      <CardDescription>
                        Acompanhe todas as assinaturas de planos - ativas, pendentes e históricas
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSubscriptionReprocessDialogOpen(true);
                      }}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reprocessar Webhook
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {subscriptions && subscriptions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Plano</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Prazo Pagamento</TableHead>
                            <TableHead>Data Criação</TableHead>
                            <TableHead>Forma Pagamento</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subscriptions
                            .filter(sub => {
                              const user = users.find(u => u.id === sub.user_id);
                              const searchLower = searchTerm.toLowerCase();
                              const matchSearch = !searchTerm || 
                                user?.nome?.toLowerCase().includes(searchLower) ||
                                user?.email?.toLowerCase().includes(searchLower) ||
                                sub.mercadopago_payment_id?.toLowerCase().includes(searchLower);

                              const matchStatus = subscriptionFilterStatus === 'todos' || sub.status === subscriptionFilterStatus;

                              return matchSearch && matchStatus;
                            })
                            .sort((a, b) => {
                              const statusOrder: Record<string, number> = { pendente: 0, ativo: 1, cancelado: 2, expirado: 3 };
                              const orderA = statusOrder[a.status] ?? 99;
                              const orderB = statusOrder[b.status] ?? 99;
                              if (orderA !== orderB) return orderA - orderB;
                              const dateA = a.data_criacao ? new Date(a.data_criacao).getTime() : 0;
                              const dateB = b.data_criacao ? new Date(b.data_criacao).getTime() : 0;
                              return dateB - dateA;
                            })
                            .map((sub) => {
                              const user = users.find(u => u.id === sub.user_id);
                              const prazoExpirado = sub.prazo_limite_pagamento && new Date(sub.prazo_limite_pagamento) < new Date();
                              const diasRestantes = sub.prazo_limite_pagamento 
                                ? Math.ceil((new Date(sub.prazo_limite_pagamento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                                : null;
                              
                              return (
                                <TableRow key={sub.id} className={prazoExpirado && sub.status === 'pendente' ? 'bg-red-50 dark:bg-red-950/20' : ''}>
                                  <TableCell>
                                    <div>
                                      <p className="font-medium">{user?.nome || 'Usuário Desconhecido'}</p>
                                      <p className="text-sm text-muted-foreground">{user?.email || '-'}</p>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="capitalize">
                                      {sub.plano.replace('_', ' ')}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="font-semibold">{formatCurrency(sub.valor)}</TableCell>
                                  <TableCell>{getStatusBadge(sub.status)}</TableCell>
                                  <TableCell>
                                    {sub.status === 'pendente' ? (
                                      sub.prazo_limite_pagamento ? (
                                        <div className="space-y-1">
                                          <div className={`text-sm font-medium ${prazoExpirado ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                            {formatDate(sub.prazo_limite_pagamento)}
                                          </div>
                                          {prazoExpirado ? (
                                            <Badge variant="destructive" className="text-xs">
                                              Expirado
                                            </Badge>
                                          ) : diasRestantes !== null && diasRestantes <= 2 ? (
                                            <Badge className="text-xs bg-orange-500">
                                              {diasRestantes} dia(s) restante(s)
                                            </Badge>
                                          ) : (
                                            <Badge variant="secondary" className="text-xs">
                                              {diasRestantes} dias
                                            </Badge>
                                          )}
                                        </div>
                                      ) : (
                                        <Badge variant="secondary" className="text-xs">
                                          Sem prazo
                                        </Badge>
                                      )
                                    ) : sub.status === 'ativo' ? (
                                      <div className="text-sm text-green-600 dark:text-green-400">
                                        Pago
                                      </div>
                                    ) : (
                                      <span className="text-muted-foreground">-</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {sub.data_criacao ? (
                                      <div className="text-sm text-muted-foreground">
                                        {formatDate(sub.data_criacao)}
                                      </div>
                                    ) : (
                                      <span className="text-muted-foreground">-</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {sub.mercadopago_payment_id ? (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-0 font-mono text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                        onClick={() => handleViewSubscriptionDetails(sub.mercadopago_payment_id || '')}
                                        data-testid={`button-view-sub-details-${sub.id}`}
                                      >
                                        {sub.mercadopago_payment_id.substring(0, 10)}...
                                      </Button>
                                    ) : (
                                      <Badge variant="secondary" className="font-mono text-xs">
                                        {sub.forma_pagamento || 'MANUAL'}
                                      </Badge>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex gap-1 justify-end flex-wrap">
                                      {sub.status === 'pendente' && sub.mercadopago_payment_id && (
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => {
                                            setSubscriptionReprocessPaymentId(sub.mercadopago_payment_id || '');
                                            setSubscriptionReprocessDialogOpen(true);
                                          }}
                                          data-testid={`button-reprocess-sub-${sub.id}`}
                                        >
                                          <RefreshCw className="h-3 w-3" />
                                        </Button>
                                      )}
                                      {(sub.status === 'ativo' || sub.status === 'pendente') && (
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                          onClick={() => {
                                            if (confirm(`Tem certeza que deseja cancelar a assinatura de ${user?.nome}?`)) {
                                              handleCancelSubscription(sub.id);
                                            }
                                          }}
                                          data-testid={`button-cancel-sub-${sub.id}`}
                                        >
                                          <Ban className="h-3 w-3" />
                                        </Button>
                                      )}
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedClientFor360(sub.user_id)}
                                      >
                                        <Eye className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          }
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {searchTerm || subscriptionFilterStatus !== "todos" 
                          ? "Nenhuma assinatura encontrada com os filtros aplicados" 
                          : "Nenhuma assinatura encontrada"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Dialog de Reprocessar Webhook de Assinatura */}
              <Dialog open={subscriptionReprocessDialogOpen} onOpenChange={setSubscriptionReprocessDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reprocessar Webhook de Assinatura</DialogTitle>
                    <DialogDescription>
                      Forçar o processamento de um pagamento já aprovado que não foi ativado automaticamente
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label>Payment ID</Label>
                      <Input 
                        placeholder="Ex: 1234567890"
                        value={subscriptionReprocessPaymentId}
                        onChange={(e) => setSubscriptionReprocessPaymentId(e.target.value)}
                        data-testid="input-sub-payment-id"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        ID do pagamento no Mercado Pago
                      </p>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSubscriptionReprocessDialogOpen(false);
                        setSubscriptionReprocessPaymentId('');
                      }}
                      data-testid="button-cancel-reprocess-sub"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleReprocessSubscription}
                      disabled={subscriptionReprocessMutation.isPending}
                      data-testid="button-confirm-reprocess-sub"
                    >
                      {subscriptionReprocessMutation.isPending ? "Reprocessando..." : "Reprocessar"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Dialog de Detalhes do Pagamento de Assinatura */}
              <Dialog open={subscriptionDetailsDialogOpen} onOpenChange={setSubscriptionDetailsDialogOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Detalhes do Pagamento</DialogTitle>
                    <DialogDescription>
                      Informações diretas do gateway de pagamento
                    </DialogDescription>
                  </DialogHeader>

                  {subscriptionPaymentDetails && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground">ID do Pagamento</Label>
                          <p className="font-mono text-sm">{subscriptionPaymentDetails.id}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Status</Label>
                          <p className="font-semibold">{subscriptionPaymentDetails.status}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">External Reference</Label>
                          <p className="font-mono text-sm">{subscriptionPaymentDetails.external_reference}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Valor</Label>
                          <p className="font-semibold">
                            {subscriptionPaymentDetails.currency_id} {subscriptionPaymentDetails.transaction_amount}
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Email do Pagador</Label>
                          <p className="text-sm">{subscriptionPaymentDetails.payer_email}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Método de Pagamento</Label>
                          <p className="text-sm">{subscriptionPaymentDetails.payment_method_id}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Data de Criação</Label>
                          <p className="text-sm">
                            {subscriptionPaymentDetails.date_created ? format(new Date(subscriptionPaymentDetails.date_created), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : '-'}
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Data de Aprovação</Label>
                          <p className="text-sm">
                            {subscriptionPaymentDetails.date_approved ? format(new Date(subscriptionPaymentDetails.date_approved), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : '-'}
                          </p>
                        </div>
                      </div>

                      {subscriptionPaymentDetails.status_detail && (
                        <div>
                          <Label className="text-muted-foreground">Detalhes do Status</Label>
                          <p className="text-sm">{subscriptionPaymentDetails.status_detail}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <DialogFooter>
                    <Button onClick={() => setSubscriptionDetailsDialogOpen(false)}>Fechar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : activeTab === 'configuracoes' ? (
            // Aba de Configurações - Apenas Mercado Pago
            <div className="space-y-6">
              <Tabs defaultValue={configTab} onValueChange={(value: any) => setConfigTab(value)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="mercadopago">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Mercado Pago
                  </TabsTrigger>
                  <TabsTrigger value="fiscalnfe">
                    <FileText className="h-4 w-4 mr-2" />
                    Nota Fiscal
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="mercadopago">
                  <MercadoPagoConfigTab />
                </TabsContent>
                <TabsContent value="fiscalnfe">
                  {/* Placeholder for FiscalNFeConfigTab - assuming it exists elsewhere */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Configuração de Nota Fiscal</CardTitle>
                      <CardDescription>Configure sua integração com o emissor de notas fiscais</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Conteúdo da configuração de NFe virá aqui...</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
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
                <CardContent className="pt-6">
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
          ) : activeTab === 'assinaturas_funcionarios' ? (
            // Aba de Assinaturas de Funcionários
            <div className="space-y-6">
              {/* Botão para Página Completa */}
              <Alert className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
                <Package className="h-5 w-5 text-purple-600" />
                <AlertTitle className="text-purple-900 dark:text-purple-100">
                  Versão Resumida - Acesse a Página Completa
                </AlertTitle>
                <AlertDescription className="flex items-center justify-between gap-4">
                  <span className="text-purple-800 dark:text-purple-200">
                    Esta é uma visão simplificada. Para acessar todas as funcionalidades como ativar pacotes manualmente, reprocessar webhooks e ver detalhes completos, clique no botão ao lado.
                  </span>
                  <Button
                    onClick={() => window.location.href = '/assinaturasfuncionarios'}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shrink-0"
                    data-testid="button-full-page"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir Página Completa
                  </Button>
                </AlertDescription>
              </Alert>

              {/* Alertas de Pagamentos Pendentes */}
              {employeePackages.filter((p: any) => p.status === 'pendente').length > 0 && (
                <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <AlertTitle className="text-amber-900 dark:text-amber-100">
                    {employeePackages.filter((p: any) => p.status === 'pendente').length} pagamento(s) aguardando confirmação
                  </AlertTitle>
                  <AlertDescription className="text-amber-800 dark:text-amber-200">
                    Os pacotes aparecerão como "Pendente" até que o Mercado Pago confirme o pagamento via webhook.
                  </AlertDescription>
                </Alert>
              )}

              {/* Cards de Estatísticas */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 border-green-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          {employeePackages.filter((p: any) => p.status === 'ativo').length}
                        </p>
                        <p className="text-sm text-muted-foreground">Pacotes Ativos</p>
                      </div>
                      <CheckCircle className="h-10 w-10 text-green-500/30" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 border-amber-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-yellow-600">
                          {employeePackages.filter((p: any) => p.status === 'pendente').length}
                        </p>
                        <p className="text-sm text-muted-foreground">Em Processamento</p>
                      </div>
                      <Clock className="h-10 w-10 text-yellow-500/30" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(
                            employeePackages
                              .filter((p: any) => p.status === 'ativo')
                              .reduce((sum: number, p: any) => sum + (p.price || 0), 0)
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">Receita Total</p>
                      </div>
                      <DollarSign className="h-10 w-10 text-blue-500/30" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 border-purple-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-purple-600">
                          {employeePackages.reduce((sum: number, p: any) => sum + (p.quantity || 0), 0)}
                        </p>
                        <p className="text-sm text-muted-foreground">Total Func. Vendidos</p>
                      </div>
                      <Users className="h-10 w-10 text-purple-500/30" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabela de Pacotes Completa */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-purple-600" />
                        Histórico Completo de Compras
                      </CardTitle>
                      <CardDescription>
                        Acompanhe todos os pacotes de funcionários - ativos, pendentes e históricos
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        queryClient.invalidateQueries({ queryKey: ["/api/admin/employee-packages"] });
                        queryClient.invalidateQueries({ queryKey: ["/api/users"] });
                      }}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Atualizar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingPackages ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                      <p className="mt-3 text-muted-foreground">Carregando pacotes...</p>
                    </div>
                  ) : employeePackages.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Nenhum pacote registrado
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        As compras de pacotes de funcionários aparecerão aqui
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Plano Atual</TableHead>
                          <TableHead>Pacote</TableHead>
                          <TableHead>Funcionários</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Mercado Pago ID</TableHead>
                          <TableHead>Data Compra</TableHead>
                          <TableHead>Vencimento</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employeePackages.map((pkg: any) => {
                          const user = users.find((u: any) => u.id === pkg.user_id);
                          const packageNames: Record<string, string> = {
                            pacote_5: "+5 Funcionários",
                            pacote_10: "+10 Funcionários",
                            pacote_20: "+20 Funcionários",
                            pacote_50: "+50 Funcionários",
                          };
                          const packageName = packageNames[pkg.package_type] || pkg.package_type;

                          return (
                            <TableRow key={pkg.id} className={pkg.status === 'pendente' ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{user?.nome || 'Usuário Desconhecido'}</p>
                                  <p className="text-xs text-muted-foreground">{user?.email || '-'}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={user?.plano === 'premium_mensal' || user?.plano === 'premium_anual' ? 'default' : 'secondary'}>
                                  {user?.plano === 'premium_mensal' ? 'Premium Mensal' :
                                   user?.plano === 'premium_anual' ? 'Premium Anual' :
                                   user?.plano === 'trial' ? 'Trial' : 'Free'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <span className="font-medium">{packageName}</span>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="font-semibold">
                                  <Users className="h-3 w-3 mr-1" />
                                  +{pkg.quantity}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-semibold text-green-600">
                                {formatCurrency(pkg.price)}
                              </TableCell>
                              <TableCell>
                                {pkg.status === 'pendente' ? (
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
                                      <Clock className="h-3 w-3 mr-1" />
                                      Processando
                                    </Badge>
                                  </div>
                                ) : (
                                  getStatusBadge(pkg.status)
                                )}
                              </TableCell>
                              <TableCell>
                                {pkg.mercadopago_payment_id ? (
                                  <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                    {pkg.mercadopago_payment_id.substring(0, 12)}...
                                  </code>
                                ) : (
                                  <span className="text-xs text-muted-foreground">Aguardando</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="text-sm">
                                    {pkg.data_compra ? formatDate(pkg.data_compra) : '-'}
                                  </span>
                                  {pkg.data_compra && (
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(pkg.data_compra).toLocaleTimeString('pt-BR', { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                      })}
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                {pkg.data_vencimento ? (
                                  <div className="flex flex-col">
                                    <span className="text-sm">{formatDate(pkg.data_vencimento)}</span>
                                    {pkg.status === 'ativo' && (() => {
                                      const daysLeft = Math.ceil(
                                        (new Date(pkg.data_vencimento).getTime() - new Date().getTime()) / 
                                        (1000 * 60 * 60 * 24)
                                      );
                                      return (
                                        <span className={`text-xs ${daysLeft <= 7 ? 'text-red-600' : 'text-green-600'}`}>
                                          {daysLeft} dias restantes
                                        </span>
                                      );
                                    })()}
                                  </div>
                                ) : (
                                  '-'
                                )}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedClientFor360(pkg.user_id)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Ver Cliente
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              {/* Informações sobre Processamento */}
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Como funciona o processamento de pagamentos
                      </h4>
                      <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">1.</span>
                          <span>Cliente seleciona um pacote e é redirecionado ao Mercado Pago</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">2.</span>
                          <span>Status inicial: <strong>"Pendente"</strong> (aguardando confirmação do pagamento)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">3.</span>
                          <span>Mercado Pago processa o pagamento e envia webhook para nosso sistema</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">4.</span>
                          <span>Sistema recebe confirmação e atualiza para <strong>"Ativo"</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">5.</span>
                          <span>Limite de funcionários é aumentado automaticamente</span>
                        </li>
                      </ul>
                      <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
                        <p className="text-sm text-blue-900 dark:text-blue-100 font-semibold">
                          ⏱️ Tempo de processamento: geralmente 5-30 segundos após o pagamento ser aprovado
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                  <CardContent>```javascript
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