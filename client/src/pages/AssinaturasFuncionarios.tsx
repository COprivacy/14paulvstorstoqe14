import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Users, Package, CheckCircle, Clock, XCircle, TrendingUp, RefreshCw, PlayCircle, Search, AlertCircle, Info, ShieldAlert } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useUser } from "@/hooks/use-user";
import { useLocation } from "wouter";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AssinaturasFuncionarios() {
  const { toast } = useToast();
  const { user } = useUser();
  const [, setLocation] = useLocation();
  
  // Verificação de acesso - apenas Admin Master
  useEffect(() => {
    if (user && (user.email !== "pavisoft.suporte@gmail.com" || user.is_admin !== "true")) {
      toast({
        title: "❌ Acesso Negado",
        description: "Esta página é restrita ao Administrador Master do sistema.",
        variant: "destructive",
      });
      setLocation("/dashboard");
    }
  }, [user, setLocation, toast]);

  // Se não é o usuário master, mostrar mensagem de acesso negado
  if (!user || user.email !== "pavisoft.suporte@gmail.com" || user.is_admin !== "true") {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-8 w-8 text-red-600" />
              <div>
                <CardTitle className="text-red-600">Acesso Negado</CardTitle>
                <CardDescription>Área Restrita</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Permissão Insuficiente</AlertTitle>
              <AlertDescription>
                Esta página é exclusiva para o Administrador Master do sistema.
                Você será redirecionado para o dashboard.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => setLocation("/dashboard")} 
              className="w-full mt-4"
              data-testid="button-back-dashboard"
            >
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [reprocessDialogOpen, setReprocessDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedPackageType, setSelectedPackageType] = useState("pacote_5");
  const [selectedQuantity, setSelectedQuantity] = useState(5);
  const [selectedPrice, setSelectedPrice] = useState(39.90);
  
  const [reprocessPaymentId, setReprocessPaymentId] = useState("");
  
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  const { data: users = [], isLoading: loadingUsers } = useQuery<any[]>({
    queryKey: ["/api/users"],
  });

  const { data: employeePackages = [], isLoading: loadingPackages } = useQuery<any[]>({
    queryKey: ["/api/admin/employee-packages"],
  });

  const activateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/admin/employee-packages/activate-manual", data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "✅ Sucesso!", description: "Pacote ativado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/employee-packages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setActivateDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ 
        title: "❌ Erro", 
        description: error.message || "Erro ao ativar pacote",
        variant: "destructive"
      });
    },
  });

  const reprocessMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/admin/employee-packages/reprocess-webhook", data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "✅ Sucesso!", description: "Webhook reprocessado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/employee-packages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setReprocessDialogOpen(false);
      setReprocessPaymentId("");
    },
    onError: (error: any) => {
      toast({ 
        title: "❌ Erro", 
        description: error.message || "Erro ao reprocessar webhook",
        variant: "destructive"
      });
    },
  });

  const cancelPackageMutation = useMutation({
    mutationFn: async (packageId: number) => {
      const res = await apiRequest("POST", `/api/admin/employee-packages/${packageId}/cancel`);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "✅ Sucesso!", description: "Pacote cancelado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/employee-packages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
    onError: (error: any) => {
      toast({ 
        title: "❌ Erro", 
        description: error.message || "Erro ao cancelar pacote",
        variant: "destructive"
      });
    },
  });

  const handleActivate = () => {
    if (!selectedUserId) {
      toast({ title: "Erro", description: "Selecione um usuário", variant: "destructive" });
      return;
    }
    
    activateMutation.mutate({
      userId: selectedUserId,
      packageType: selectedPackageType,
      quantity: selectedQuantity,
      price: selectedPrice,
    });
  };

  const handleReprocess = () => {
    if (!reprocessPaymentId) {
      toast({ title: "Erro", description: "Digite o Payment ID", variant: "destructive" });
      return;
    }
    
    reprocessMutation.mutate({
      paymentId: reprocessPaymentId,
      gateway: "mercadopago",
    });
  };

  const handleViewDetails = async (paymentId: string, gateway: string = "mercadopago") => {
    try {
      const res = await fetch(`/api/admin/employee-packages/payment-details/${paymentId}?gateway=${gateway}`, {
        headers: {
          "x-user-id": localStorage.getItem("userId") || "",
        },
      });
      
      if (!res.ok) {
        throw new Error("Erro ao buscar detalhes do pagamento");
      }
      
      const data = await res.json();
      setPaymentDetails(data.payment);
      setDetailsDialogOpen(true);
    } catch (error: any) {
      toast({ 
        title: "Erro", 
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const packageTypeOptions = [
    { value: "pacote_5", label: "+5 Funcionários", quantity: 5, price: 39.90 },
    { value: "pacote_10", label: "+10 Funcionários", quantity: 10, price: 69.90 },
    { value: "pacote_20", label: "+20 Funcionários", quantity: 20, price: 119.90 },
    { value: "pacote_50", label: "+50 Funcionários", quantity: 50, price: 249.90 },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; icon: any; label: string }> = {
      ativo: { variant: "default", icon: CheckCircle, label: "Ativo" },
      pendente: { variant: "outline", icon: Clock, label: "Pendente" },
      cancelado: { variant: "destructive", icon: XCircle, label: "Cancelado" },
      expirado: { variant: "secondary", icon: XCircle, label: "Expirado" },
    };

    const config = statusConfig[status] || statusConfig.pendente;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getPackageName = (type: string) => {
    const packages: Record<string, string> = {
      pacote_5: "+5 Funcionários",
      pacote_10: "+10 Funcionários",
      pacote_20: "+20 Funcionários",
      pacote_50: "+50 Funcionários",
    };
    return packages[type] || type;
  };

  if (loadingUsers || loadingPackages) {
    return <div className="p-6">Carregando...</div>;
  }

  const packagesFiltrados = employeePackages
    .filter(p => filterStatus === "todos" || p.status === filterStatus)
    .filter(p => {
      if (!searchTerm) return true;
      const user = users.find(u => u.id === p.user_id);
      const searchLower = searchTerm.toLowerCase();
      return (
        user?.nome?.toLowerCase().includes(searchLower) ||
        user?.email?.toLowerCase().includes(searchLower) ||
        p.payment_id?.toLowerCase().includes(searchLower)
      );
    });

  const totalAtivos = employeePackages.filter(p => p.status === 'ativo').length;
  const totalPendentes = employeePackages.filter(p => p.status === 'pendente').length;
  const receitaMensal = employeePackages
    .filter(p => p.status === 'ativo')
    .reduce((sum, p) => sum + (p.price || 0), 0);
  const totalFuncionariosVendidos = employeePackages
    .filter(p => p.status === 'ativo')
    .reduce((sum, p) => sum + (p.quantity || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gerenciamento de Pacotes
          </h1>
          <p className="text-muted-foreground">
            Controle total sobre compras de pacotes de funcionários
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Dialog open={activateDialogOpen} onOpenChange={setActivateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" data-testid="button-activate-manual">
                <PlayCircle className="h-4 w-4 mr-2" />
                Ativar Manualmente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ativar Pacote Manualmente</DialogTitle>
                <DialogDescription>
                  Ative um pacote de funcionários para um cliente sem passar pelo gateway de pagamento
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label>Selecionar Cliente</Label>
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger data-testid="select-user">
                      <SelectValue placeholder="Escolha um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.nome} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Tipo de Pacote</Label>
                  <Select 
                    value={selectedPackageType} 
                    onValueChange={(value) => {
                      setSelectedPackageType(value);
                      const opt = packageTypeOptions.find(o => o.value === value);
                      if (opt) {
                        setSelectedQuantity(opt.quantity);
                        setSelectedPrice(opt.price);
                      }
                    }}
                  >
                    <SelectTrigger data-testid="select-package-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {packageTypeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label} - {formatCurrency(opt.price)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Quantidade</Label>
                    <Input 
                      type="number" 
                      value={selectedQuantity}
                      onChange={(e) => setSelectedQuantity(parseInt(e.target.value))}
                      data-testid="input-quantity"
                    />
                  </div>
                  <div>
                    <Label>Valor (R$)</Label>
                    <Input 
                      type="number" 
                      step="0.01"
                      value={selectedPrice}
                      onChange={(e) => setSelectedPrice(parseFloat(e.target.value))}
                      data-testid="input-price"
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setActivateDialogOpen(false)}
                  data-testid="button-cancel-activate"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleActivate}
                  disabled={activateMutation.isPending}
                  data-testid="button-confirm-activate"
                >
                  {activateMutation.isPending ? "Ativando..." : "Ativar Pacote"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={reprocessDialogOpen} onOpenChange={setReprocessDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" data-testid="button-reprocess-webhook">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reprocessar Webhook
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reprocessar Webhook</DialogTitle>
                <DialogDescription>
                  Forçar o processamento de um pagamento já aprovado que não foi ativado automaticamente
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label>Payment ID</Label>
                  <Input 
                    placeholder="Ex: 1234567890"
                    value={reprocessPaymentId}
                    onChange={(e) => setReprocessPaymentId(e.target.value)}
                    data-testid="input-payment-id"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    ID do pagamento no Mercado Pago
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setReprocessDialogOpen(false)}
                  data-testid="button-cancel-reprocess"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleReprocess}
                  disabled={reprocessMutation.isPending}
                  data-testid="button-confirm-reprocess"
                >
                  {reprocessMutation.isPending ? "Reprocessando..." : "Reprocessar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Alerta de Ajuda */}
      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="space-y-1">
              <CardTitle className="text-base text-blue-900 dark:text-blue-100">
                Como usar esta ferramenta
              </CardTitle>
              <CardDescription className="text-sm text-blue-700 dark:text-blue-300">
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li><strong>Ativar Manualmente:</strong> Cria um pacote sem pagamento (útil para bônus/cortesia)</li>
                  <li><strong>Reprocessar Webhook:</strong> Processa pagamentos aprovados que falharam no webhook</li>
                  <li><strong>Ver Detalhes:</strong> Clique no Payment ID para ver status no gateway</li>
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
            <CardTitle className="text-sm font-medium">Pacotes Ativos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAtivos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Processamento</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPendentes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(receitaMensal)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Func. Vendidos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFuncionariosVendidos}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
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
                  data-testid="input-search"
                />
              </div>
            </div>
            
            <div className="w-[200px]">
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger data-testid="select-filter-status">
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

      {/* Tabela de Pacotes */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico Completo de Compras</CardTitle>
          <CardDescription>
            Acompanhe todos os pacotes de funcionários - ativos, pendentes e históricos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {packagesFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || filterStatus !== "todos" 
                  ? "Nenhum pacote encontrado com os filtros aplicados" 
                  : "Nenhum pacote de funcionários foi comprado ainda"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Pacote</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Data Compra</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packagesFiltrados.map((pkg) => {
                    const user = users.find(u => u.id === pkg.user_id);
                    const isManualPayment = pkg.payment_id?.startsWith("MANUAL_");
                    
                    return (
                      <TableRow key={pkg.id} data-testid={`row-package-${pkg.id}`}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user?.nome || 'Usuário Desconhecido'}</p>
                            <p className="text-sm text-muted-foreground">{user?.email || '-'}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getPackageName(pkg.package_type)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            <Users className="h-3 w-3 mr-1" />
                            {pkg.quantity}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">{formatCurrency(pkg.price)}</TableCell>
                        <TableCell>{getStatusBadge(pkg.status)}</TableCell>
                        <TableCell>
                          {isManualPayment ? (
                            <Badge variant="secondary" className="font-mono text-xs">
                              MANUAL
                            </Badge>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 font-mono text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                              onClick={() => handleViewDetails(pkg.payment_id)}
                              data-testid={`button-view-details-${pkg.id}`}
                            >
                              {pkg.payment_id?.substring(0, 12)}...
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          {pkg.data_compra ? format(new Date(pkg.data_compra), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
                        </TableCell>
                        <TableCell>
                          {pkg.data_vencimento ? format(new Date(pkg.data_vencimento), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {pkg.status === 'pendente' && !isManualPayment && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setReprocessPaymentId(pkg.payment_id);
                                  setReprocessDialogOpen(true);
                                }}
                                data-testid={`button-reprocess-${pkg.id}`}
                              >
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Reprocessar
                              </Button>
                            )}
                            {pkg.status === 'ativo' && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                    data-testid={`button-cancel-${pkg.id}`}
                                  >
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Cancelar
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Cancelar Pacote de Funcionários</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja cancelar este pacote? Esta ação irá:
                                      <ul className="list-disc list-inside mt-2 space-y-1">
                                        <li>Reduzir o limite de funcionários do usuário</li>
                                        <li>Bloquear funcionários excedentes automaticamente</li>
                                        <li>Marcar o pacote como cancelado</li>
                                      </ul>
                                      <p className="mt-2 font-semibold text-destructive">
                                        Esta ação não pode ser desfeita!
                                      </p>
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel data-testid="button-cancel-cancel">
                                      Voltar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => cancelPackageMutation.mutate(pkg.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      data-testid={`button-confirm-cancel-${pkg.id}`}
                                    >
                                      {cancelPackageMutation.isPending ? "Cancelando..." : "Sim, cancelar pacote"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Detalhes do Pagamento */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Pagamento</DialogTitle>
            <DialogDescription>
              Informações diretas do gateway de pagamento
            </DialogDescription>
          </DialogHeader>
          
          {paymentDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">ID do Pagamento</Label>
                  <p className="font-mono text-sm">{paymentDetails.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <p className="font-semibold">{paymentDetails.status}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">External Reference</Label>
                  <p className="font-mono text-sm">{paymentDetails.external_reference}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Valor</Label>
                  <p className="font-semibold">
                    {paymentDetails.currency_id} {paymentDetails.transaction_amount}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email do Pagador</Label>
                  <p className="text-sm">{paymentDetails.payer_email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Método de Pagamento</Label>
                  <p className="text-sm">{paymentDetails.payment_method_id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Data de Criação</Label>
                  <p className="text-sm">
                    {paymentDetails.date_created ? format(new Date(paymentDetails.date_created), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : '-'}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Data de Aprovação</Label>
                  <p className="text-sm">
                    {paymentDetails.date_approved ? format(new Date(paymentDetails.date_approved), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : '-'}
                  </p>
                </div>
              </div>
              
              {paymentDetails.status_detail && (
                <div>
                  <Label className="text-muted-foreground">Detalhes do Status</Label>
                  <p className="text-sm">{paymentDetails.status_detail}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setDetailsDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
