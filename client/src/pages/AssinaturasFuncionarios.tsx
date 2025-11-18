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

  const packagesFiltrados = employeePackages.filter(p => p.status === 'ativo' || p.status === 'pendente');

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

  const totalAtivos = packagesFiltrados.filter(p => p.status === 'ativo').length;
  const totalPendentes = packagesFiltrados.filter(p => p.status === 'pendente').length;
  const receitaMensal = packagesFiltrados
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

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacotes Ativos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAtivos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPendentes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(receitaMensal)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Pacotes */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Compras</CardTitle>
          <CardDescription>
            Todas as compras de pacotes de funcionários realizadas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {employeePackages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum pacote de funcionários foi comprado ainda
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Pacote</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Compra</TableHead>
                  <TableHead>Vencimento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeePackages.map((pkg) => {
                  const user = users.find(u => u.id === pkg.user_id);
                  return (
                    <TableRow key={pkg.id}>
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
                        {pkg.data_compra ? format(new Date(pkg.data_compra), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
                      </TableCell>
                      <TableCell>
                        {pkg.data_vencimento ? format(new Date(pkg.data_vencimento), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}