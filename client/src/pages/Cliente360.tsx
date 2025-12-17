import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { Cliente360Timeline } from "@/components/Cliente360Timeline";
import { Cliente360Notes } from "@/components/Cliente360Notes";
import { 
  Users, 
  Search, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  CreditCard, 
  ShoppingBag,
  Calendar,
  Heart,
  Activity,
  ChevronRight,
  RefreshCw,
  UserCheck,
  UserX,
  Package,
  BarChart3
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface User {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  cpf_cnpj?: string;
  plano: string;
  status: string;
  data_criacao?: string;
  data_expiracao_plano?: string;
  data_expiracao_trial?: string;
}

interface ChurnAlert {
  user_id: string;
  user_name: string;
  user_email: string;
  plano: string;
  status: string;
  risk_score: number;
  risk_factors: string[];
  expiration_date?: string;
}

interface HealthScore {
  score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  factors: { name: string; impact: number; description: string }[];
  metrics: {
    days_as_customer: number;
    total_subscriptions: number;
    pending_payments: number;
    late_payments: number;
  };
}

interface PaymentHistory {
  payments: {
    id: number;
    plano: string;
    valor: number;
    valor_desconto: number;
    cupom?: string;
    status: string;
    status_pagamento: string;
    forma_pagamento?: string;
    data_inicio?: string;
    data_vencimento?: string;
    data_criacao: string;
    mercadopago_payment_id?: string;
  }[];
  total_paid: number;
  total_subscriptions: number;
  active_subscriptions: number;
}

interface UsageStats {
  top_products: { name: string; quantity: number; revenue: number }[];
  total_sales: number;
  total_revenue: number;
  average_ticket: number;
  monthly_stats: { month: string; sales: number; revenue: number }[];
}

interface ClientSummary {
  user: {
    id: string;
    nome: string;
    email: string;
    telefone?: string;
    cpf_cnpj?: string;
    plano: string;
    status: string;
    data_criacao?: string;
    data_expiracao?: string;
  };
  metrics: {
    days_as_customer: number;
    days_until_expiration: number | null;
    total_paid_subscriptions: number;
    total_sales_revenue: number;
    total_sales_count: number;
    active_employees: number;
    total_employees: number;
    total_subscriptions: number;
  };
}

function getRiskColor(level: string) {
  switch (level) {
    case 'low': return 'bg-green-500/10 text-green-700 border-green-500/30';
    case 'medium': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/30';
    case 'high': return 'bg-orange-500/10 text-orange-700 border-orange-500/30';
    case 'critical': return 'bg-red-500/10 text-red-700 border-red-500/30';
    default: return 'bg-gray-500/10 text-gray-700 border-gray-500/30';
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'ativo': return <Badge variant="default" className="bg-green-600">Ativo</Badge>;
    case 'inativo': return <Badge variant="destructive">Inativo</Badge>;
    case 'pendente': return <Badge variant="secondary">Pendente</Badge>;
    case 'approved': return <Badge variant="default" className="bg-green-600">Aprovado</Badge>;
    case 'pending': return <Badge variant="secondary">Pendente</Badge>;
    case 'rejected': return <Badge variant="destructive">Rejeitado</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(date: string | undefined) {
  if (!date) return '-';
  try {
    return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
  } catch {
    return date;
  }
}

export default function Cliente360() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("alerts");

  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/users");
      return response.json();
    },
  });

  const { data: churnAlerts, isLoading: alertsLoading, refetch: refetchAlerts } = useQuery({
    queryKey: ['/api/admin/clients/churn-alerts'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/clients/churn-alerts");
      return response.json();
    },
  });

  const { data: clientSummary, isLoading: summaryLoading } = useQuery<ClientSummary>({
    queryKey: ['/api/admin/clients', selectedUserId, '360-summary'],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/admin/clients/${selectedUserId}/360-summary`);
      return response.json();
    },
    enabled: !!selectedUserId,
  });

  const { data: healthScore, isLoading: healthLoading } = useQuery<HealthScore>({
    queryKey: ['/api/admin/clients', selectedUserId, 'health-score'],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/admin/clients/${selectedUserId}/health-score`);
      return response.json();
    },
    enabled: !!selectedUserId,
  });

  const { data: paymentHistory, isLoading: paymentsLoading } = useQuery<PaymentHistory>({
    queryKey: ['/api/admin/clients', selectedUserId, 'payment-history'],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/admin/clients/${selectedUserId}/payment-history`);
      return response.json();
    },
    enabled: !!selectedUserId,
  });

  const { data: usageStats, isLoading: usageLoading } = useQuery<UsageStats>({
    queryKey: ['/api/admin/clients', selectedUserId, 'usage-stats'],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/admin/clients/${selectedUserId}/usage-stats`);
      return response.json();
    },
    enabled: !!selectedUserId,
  });

  const filteredUsers = users.filter(user => 
    user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full p-4 gap-4" data-testid="cliente360-page">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" data-testid="text-page-title">
            <Users className="h-6 w-6" />
            Gestao de Clientes 360
          </h1>
          <p className="text-muted-foreground">Visao completa e analises avancadas dos clientes</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => refetchAlerts()}
          data-testid="button-refresh-alerts"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        <div className="lg:col-span-1 flex flex-col gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Clientes</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-client"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[300px]">
                {usersLoading ? (
                  <div className="p-4 text-center text-muted-foreground">Carregando...</div>
                ) : filteredUsers.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">Nenhum cliente encontrado</div>
                ) : (
                  <div className="divide-y">
                    {filteredUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => setSelectedUserId(user.id)}
                        className={`w-full p-3 text-left hover-elevate transition-colors flex items-center justify-between gap-2 ${
                          selectedUserId === user.id ? 'bg-primary/10' : ''
                        }`}
                        data-testid={`button-select-client-${user.id}`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{user.nome}</p>
                          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(user.status)}
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Alertas de Risco
              </CardTitle>
              <CardDescription>
                {churnAlerts?.critical_count || 0} criticos, {churnAlerts?.warning_count || 0} avisos
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[250px]">
                {alertsLoading ? (
                  <div className="p-4 text-center text-muted-foreground">Carregando alertas...</div>
                ) : !churnAlerts?.alerts?.length ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <UserCheck className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    Nenhum cliente em risco
                  </div>
                ) : (
                  <div className="divide-y">
                    {churnAlerts.alerts.slice(0, 20).map((alert: ChurnAlert) => (
                      <button
                        key={alert.user_id}
                        onClick={() => setSelectedUserId(alert.user_id)}
                        className="w-full p-3 text-left hover-elevate transition-colors"
                        data-testid={`button-alert-${alert.user_id}`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="font-medium truncate">{alert.user_name}</p>
                          <Badge className={getRiskColor(alert.risk_score >= 50 ? 'critical' : 'high')}>
                            {alert.risk_score}%
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {alert.risk_factors.map((factor, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {!selectedUserId ? (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center p-8">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">Selecione um cliente</h3>
                <p className="text-muted-foreground">
                  Escolha um cliente na lista ao lado para ver os detalhes completos
                </p>
              </div>
            </Card>
          ) : (
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-3">
                {summaryLoading ? (
                  <div className="animate-pulse">
                    <div className="h-6 w-48 bg-muted rounded mb-2" />
                    <div className="h-4 w-32 bg-muted rounded" />
                  </div>
                ) : clientSummary ? (
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">{clientSummary.user.nome}</CardTitle>
                      <CardDescription>{clientSummary.user.email}</CardDescription>
                      <div className="flex gap-2 mt-2">
                        {getStatusBadge(clientSummary.user.status)}
                        <Badge variant="outline">{clientSummary.user.plano}</Badge>
                      </div>
                    </div>
                    {healthScore && (
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Heart className={`h-5 w-5 ${
                            healthScore.risk_level === 'low' ? 'text-green-500' :
                            healthScore.risk_level === 'medium' ? 'text-yellow-500' :
                            healthScore.risk_level === 'high' ? 'text-orange-500' :
                            'text-red-500'
                          }`} />
                          <span className="text-2xl font-bold">{healthScore.score}</span>
                        </div>
                        <Badge className={getRiskColor(healthScore.risk_level)}>
                          {healthScore.risk_level === 'low' ? 'Saudavel' :
                           healthScore.risk_level === 'medium' ? 'Atencao' :
                           healthScore.risk_level === 'high' ? 'Risco' : 'Critico'}
                        </Badge>
                      </div>
                    )}
                  </div>
                ) : null}
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col min-h-0 pt-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-xs">Total Pago</span>
                    </div>
                    <p className="text-lg font-bold" data-testid="text-total-paid">
                      {paymentHistory ? formatCurrency(paymentHistory.total_paid) : '-'}
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <ShoppingBag className="h-4 w-4" />
                      <span className="text-xs">Vendas</span>
                    </div>
                    <p className="text-lg font-bold" data-testid="text-total-sales">
                      {usageStats ? usageStats.total_sales : '-'}
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs">Cliente ha</span>
                    </div>
                    <p className="text-lg font-bold">
                      {clientSummary ? `${clientSummary.metrics.days_as_customer} dias` : '-'}
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Users className="h-4 w-4" />
                      <span className="text-xs">Funcionarios</span>
                    </div>
                    <p className="text-lg font-bold">
                      {clientSummary ? clientSummary.metrics.active_employees : '-'}
                    </p>
                  </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                  <TabsList className="grid grid-cols-5 w-full">
                    <TabsTrigger value="health" data-testid="tab-health">
                      <Activity className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Saude</span>
                    </TabsTrigger>
                    <TabsTrigger value="payments" data-testid="tab-payments">
                      <CreditCard className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Pagamentos</span>
                    </TabsTrigger>
                    <TabsTrigger value="products" data-testid="tab-products">
                      <Package className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Produtos</span>
                    </TabsTrigger>
                    <TabsTrigger value="timeline" data-testid="tab-timeline">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Timeline</span>
                    </TabsTrigger>
                    <TabsTrigger value="notes" data-testid="tab-notes">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Notas</span>
                    </TabsTrigger>
                  </TabsList>

                  <ScrollArea className="flex-1 mt-4">
                    <TabsContent value="health" className="m-0">
                      {healthLoading ? (
                        <div className="text-center py-8 text-muted-foreground">Carregando...</div>
                      ) : healthScore ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium">Score de Saude</span>
                                <span className="text-sm font-bold">{healthScore.score}/100</span>
                              </div>
                              <Progress value={healthScore.score} className="h-3" />
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h4 className="font-medium mb-3">Fatores que afetam o score</h4>
                            <div className="space-y-2">
                              {healthScore.factors.length === 0 ? (
                                <p className="text-muted-foreground text-sm">Nenhum fator identificado</p>
                              ) : (
                                healthScore.factors.map((factor, i) => (
                                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                                    <span className="text-sm">{factor.description}</span>
                                    <Badge className={factor.impact > 0 ? 'bg-green-500/10 text-green-700' : 'bg-red-500/10 text-red-700'}>
                                      {factor.impact > 0 ? '+' : ''}{factor.impact}
                                    </Badge>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          <Separator />

                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-lg border">
                              <p className="text-sm text-muted-foreground">Pagamentos Pendentes</p>
                              <p className="text-xl font-bold">{healthScore.metrics.pending_payments}</p>
                            </div>
                            <div className="p-3 rounded-lg border">
                              <p className="text-sm text-muted-foreground">Pagamentos Atrasados</p>
                              <p className="text-xl font-bold text-red-500">{healthScore.metrics.late_payments}</p>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </TabsContent>

                    <TabsContent value="payments" className="m-0">
                      {paymentsLoading ? (
                        <div className="text-center py-8 text-muted-foreground">Carregando...</div>
                      ) : paymentHistory ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="p-3 rounded-lg border text-center">
                              <p className="text-sm text-muted-foreground">Total Pago</p>
                              <p className="text-xl font-bold text-green-600">{formatCurrency(paymentHistory.total_paid)}</p>
                            </div>
                            <div className="p-3 rounded-lg border text-center">
                              <p className="text-sm text-muted-foreground">Assinaturas</p>
                              <p className="text-xl font-bold">{paymentHistory.total_subscriptions}</p>
                            </div>
                            <div className="p-3 rounded-lg border text-center">
                              <p className="text-sm text-muted-foreground">Ativas</p>
                              <p className="text-xl font-bold text-green-600">{paymentHistory.active_subscriptions}</p>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <h4 className="font-medium mb-3">Historico de Pagamentos</h4>
                            {paymentHistory.payments.length === 0 ? (
                              <p className="text-muted-foreground text-sm text-center py-4">Nenhum pagamento registrado</p>
                            ) : (
                              <div className="space-y-2">
                                {paymentHistory.payments.map((payment) => (
                                  <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg border">
                                    <div>
                                      <p className="font-medium">{payment.plano}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {formatDate(payment.data_criacao)}
                                        {payment.cupom && ` - Cupom: ${payment.cupom}`}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-bold">{formatCurrency(payment.valor)}</p>
                                      {getStatusBadge(payment.status_pagamento || payment.status)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </TabsContent>

                    <TabsContent value="products" className="m-0">
                      {usageLoading ? (
                        <div className="text-center py-8 text-muted-foreground">Carregando...</div>
                      ) : usageStats ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="p-3 rounded-lg border text-center">
                              <p className="text-sm text-muted-foreground">Total Vendas</p>
                              <p className="text-xl font-bold">{usageStats.total_sales}</p>
                            </div>
                            <div className="p-3 rounded-lg border text-center">
                              <p className="text-sm text-muted-foreground">Receita Total</p>
                              <p className="text-xl font-bold text-green-600">{formatCurrency(usageStats.total_revenue)}</p>
                            </div>
                            <div className="p-3 rounded-lg border text-center">
                              <p className="text-sm text-muted-foreground">Ticket Medio</p>
                              <p className="text-xl font-bold">{formatCurrency(usageStats.average_ticket)}</p>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <h4 className="font-medium mb-3">Top 10 Produtos Mais Vendidos</h4>
                            {usageStats.top_products.length === 0 ? (
                              <p className="text-muted-foreground text-sm text-center py-4">Nenhum produto vendido</p>
                            ) : (
                              <div className="space-y-2">
                                {usageStats.top_products.map((product, i) => (
                                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                      <span className="text-lg font-bold text-muted-foreground">#{i + 1}</span>
                                      <div>
                                        <p className="font-medium">{product.name}</p>
                                        <p className="text-sm text-muted-foreground">{product.quantity} unidades</p>
                                      </div>
                                    </div>
                                    <p className="font-bold">{formatCurrency(product.revenue)}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {usageStats.monthly_stats.length > 0 && (
                            <>
                              <Separator />
                              <div>
                                <h4 className="font-medium mb-3">Vendas por Mes (Ultimos 6 meses)</h4>
                                <div className="space-y-2">
                                  {usageStats.monthly_stats.map((stat) => (
                                    <div key={stat.month} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                                      <span className="text-sm font-medium">{stat.month}</span>
                                      <div className="flex gap-4">
                                        <span className="text-sm">{stat.sales} vendas</span>
                                        <span className="text-sm font-bold">{formatCurrency(stat.revenue)}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ) : null}
                    </TabsContent>

                    <TabsContent value="timeline" className="m-0">
                      <Cliente360Timeline userId={selectedUserId} />
                    </TabsContent>

                    <TabsContent value="notes" className="m-0">
                      <Cliente360Notes userId={selectedUserId} />
                    </TabsContent>
                  </ScrollArea>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
