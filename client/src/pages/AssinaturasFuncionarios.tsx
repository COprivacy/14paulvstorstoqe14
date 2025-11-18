
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Package, CheckCircle, Clock, XCircle, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AssinaturasFuncionarios() {
  const { data: users = [], isLoading: loadingUsers } = useQuery<any[]>({
    queryKey: ["/api/users"],
  });

  const { data: employeePackages = [], isLoading: loadingPackages } = useQuery<any[]>({
    queryKey: ["/api/admin/employee-packages"],
  });

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

  const totalAtivos = employeePackages.filter(p => p.status === 'ativo').length;
  const totalPendentes = employeePackages.filter(p => p.status === 'pendente').length;
  const receitaMensal = employeePackages
    .filter(p => p.status === 'ativo')
    .reduce((sum, p) => sum + (p.price || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Assinaturas de Funcionários
        </h1>
        <p className="text-muted-foreground">
          Gerenciar compras de pacotes de funcionários
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacotes Ativos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAtivos}</div>
            <p className="text-xs text-muted-foreground">Pacotes em uso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPendentes}</div>
            <p className="text-xs text-muted-foreground">Aguardando pagamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(receitaMensal)}</div>
            <p className="text-xs text-muted-foreground">De pacotes ativos</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Histórico de Compras
          </CardTitle>
          <CardDescription>
            Todas as compras de pacotes de funcionários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Pacote</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Compra</TableHead>
                <TableHead>Vencimento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeePackages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Nenhuma compra de pacote registrada
                  </TableCell>
                </TableRow>
              ) : (
                employeePackages.map((pkg: any) => {
                  const user = users.find(u => u.id === pkg.user_id);
                  return (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">
                        {user?.nome || user?.email || '-'}
                      </TableCell>
                      <TableCell>{getPackageName(pkg.package_type)}</TableCell>
                      <TableCell>{formatCurrency(pkg.price)}</TableCell>
                      <TableCell>{getStatusBadge(pkg.status)}</TableCell>
                      <TableCell>
                        {pkg.data_compra ? format(new Date(pkg.data_compra), "dd/MM/yyyy", { locale: ptBR }) : '-'}
                      </TableCell>
                      <TableCell>
                        {pkg.data_vencimento ? format(new Date(pkg.data_vencimento), "dd/MM/yyyy", { locale: ptBR }) : '-'}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
