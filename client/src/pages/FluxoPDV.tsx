
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Calendar, AlertCircle } from "lucide-react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Bar, BarChart } from "recharts";
import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function FluxoPDV() {
  const { data: contasPagar = [] } = useQuery({
    queryKey: ["/api/contas-pagar"],
  });

  const { data: contasReceber = [] } = useQuery({
    queryKey: ["/api/contas-receber"],
  });

  const { data: vendas = [] } = useQuery({
    queryKey: ["/api/vendas"],
  });

  // Estados para filtros personalizáveis
  const [diasProjecao, setDiasProjecao] = useState(30);
  const [incluirVencidas, setIncluirVencidas] = useState(false);

  // Calcular entradas e saídas projetadas
  const hoje = new Date();
  const dataFutura = new Date();
  dataFutura.setDate(hoje.getDate() + diasProjecao);

  // Calcular contas vencidas
  const contasVencidas = useMemo(() => {
    const pagarVencidas = contasPagar.filter((c: any) => {
      if (c.status === 'pago') return false;
      if (!c.data_vencimento) return false;
      return new Date(c.data_vencimento) < hoje;
    });

    const receberVencidas = contasReceber.filter((c: any) => {
      if (c.status === 'recebido') return false;
      if (!c.data_vencimento) return false;
      return new Date(c.data_vencimento) < hoje;
    });

    const totalPagarVencido = pagarVencidas.reduce((sum: number, c: any) => sum + (c.valor || 0), 0);
    const totalReceberVencido = receberVencidas.reduce((sum: number, c: any) => sum + (c.valor || 0), 0);

    return { 
      pagar: pagarVencidas.length,
      receber: receberVencidas.length,
      totalPagar: totalPagarVencido,
      totalReceber: totalReceberVencido
    };
  }, [contasPagar, contasReceber]);

  const entradaProjetada = useMemo(() => {
    let total = contasReceber
      .filter((c: any) => {
        if (c.status === 'recebido') return false;
        if (!c.data_vencimento) return false;
        const vencimento = new Date(c.data_vencimento);
        return vencimento >= hoje && vencimento <= dataFutura;
      })
      .reduce((sum: number, c: any) => sum + (c.valor || 0), 0);

    if (incluirVencidas) {
      total += contasVencidas.totalReceber;
    }

    return total;
  }, [contasReceber, diasProjecao, incluirVencidas, contasVencidas.totalReceber]);

  const saidaProjetada = useMemo(() => {
    let total = contasPagar
      .filter((c: any) => {
        if (c.status === 'pago') return false;
        if (!c.data_vencimento) return false;
        const vencimento = new Date(c.data_vencimento);
        return vencimento >= hoje && vencimento <= dataFutura;
      })
      .reduce((sum: number, c: any) => sum + (c.valor || 0), 0);

    if (incluirVencidas) {
      total += contasVencidas.totalPagar;
    }

    return total;
  }, [contasPagar, diasProjecao, incluirVencidas, contasVencidas.totalPagar]);

  const saldoProjetado = entradaProjetada - saidaProjetada;

  // Gráfico de fluxo semanal
  const chartData = useMemo(() => {
    const numSemanas = Math.ceil(diasProjecao / 7);
    const semanas = Array.from({ length: numSemanas }, (_, i) => {
      const inicioSemana = new Date(hoje);
      inicioSemana.setDate(hoje.getDate() + (i * 7));
      const fimSemana = new Date(inicioSemana);
      fimSemana.setDate(inicioSemana.getDate() + 6);

      const entradaSemana = contasReceber
        .filter((c: any) => {
          if (c.status === 'recebido') return false;
          if (!c.data_vencimento) return false;
          const vencimento = new Date(c.data_vencimento);
          return vencimento >= inicioSemana && vencimento <= fimSemana;
        })
        .reduce((sum: number, c: any) => sum + (c.valor || 0), 0);

      const saidaSemana = contasPagar
        .filter((c: any) => {
          if (c.status === 'pago') return false;
          if (!c.data_vencimento) return false;
          const vencimento = new Date(c.data_vencimento);
          return vencimento >= inicioSemana && vencimento <= fimSemana;
        })
        .reduce((sum: number, c: any) => sum + (c.valor || 0), 0);

      return {
        semana: `Semana ${i + 1}`,
        entrada: Number(entradaSemana.toFixed(2)),
        saida: Number(saidaSemana.toFixed(2)),
        saldo: Number((entradaSemana - saidaSemana).toFixed(2)),
      };
    });

    return semanas;
  }, [contasPagar, contasReceber, diasProjecao]);

  const temDados = chartData.some(d => d.entrada > 0 || d.saida > 0);

  // Análise por categoria de despesa
  const despesasPorCategoria = useMemo(() => {
    const categorias: Record<string, number> = {};
    
    contasPagar
      .filter((c: any) => c.status === 'pendente')
      .forEach((c: any) => {
        const cat = c.categoria || 'Outras';
        categorias[cat] = (categorias[cat] || 0) + (c.valor || 0);
      });

    return Object.entries(categorias)
      .map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [contasPagar]);

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold dark:text-white">Fluxo de Caixa Projetado</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Análise de fluxo de caixa baseado em contas a pagar e receber
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Filtros de Projeção</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dias-projecao" className="text-sm font-medium">
                Período de Projeção (dias)
              </Label>
              <Input
                id="dias-projecao"
                type="number"
                min="7"
                max="365"
                value={diasProjecao}
                onChange={(e) => setDiasProjecao(Math.max(7, Math.min(365, parseInt(e.target.value) || 30)))}
              />
              <p className="text-xs text-muted-foreground">
                Analisando os próximos {diasProjecao} dias
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Incluir Contas Vencidas</Label>
              <div className="flex items-center gap-3">
                <Switch
                  id="incluir-vencidas"
                  checked={incluirVencidas}
                  onCheckedChange={setIncluirVencidas}
                />
                <Label htmlFor="incluir-vencidas" className="text-sm font-normal cursor-pointer">
                  {incluirVencidas ? 'Incluídas nos cálculos' : 'Apenas contas futuras'}
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Valores Principais */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-green-200 dark:border-green-900/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Entrada Projetada
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold text-green-600" data-testid="text-entrada-projetada">
              R$ {entradaProjetada.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Próximos {diasProjecao} dias</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-red-900/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Saída Projetada
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold text-red-600" data-testid="text-saida-projetada">
              R$ {saidaProjetada.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Próximos {diasProjecao} dias</p>
          </CardContent>
        </Card>

        <Card className={`border-2 ${saldoProjetado >= 0 ? 'border-blue-300 dark:border-blue-900/50' : 'border-red-300 dark:border-red-900/50'}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Saldo Projetado
              </CardTitle>
              <DollarSign className={`h-4 w-4 ${saldoProjetado >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className={`text-2xl font-bold ${saldoProjetado >= 0 ? 'text-blue-600' : 'text-red-600'}`} data-testid="text-saldo-projetado">
              R$ {saldoProjetado.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Próximos {diasProjecao} dias</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerta de Contas Vencidas */}
      {(contasVencidas.pagar > 0 || contasVencidas.receber > 0) && (
        <Card className="border-orange-300 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900/50">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-lg text-orange-800 dark:text-orange-300">
                Contas Vencidas
              </CardTitle>
            </div>
            <CardDescription className="text-orange-700 dark:text-orange-400">
              Valores em atraso que requerem atenção
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {contasVencidas.pagar > 0 && (
                <div className="p-4 bg-white dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-900/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-orange-800 dark:text-orange-300">
                      A Pagar
                    </span>
                    <span className="text-sm font-bold px-2 py-1 bg-orange-100 dark:bg-orange-900/50 rounded">
                      {contasVencidas.pagar}
                    </span>
                  </div>
                  <div className="text-xl font-bold text-red-600">
                    R$ {contasVencidas.totalPagar.toFixed(2)}
                  </div>
                </div>
              )}
              {contasVencidas.receber > 0 && (
                <div className="p-4 bg-white dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-900/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-orange-800 dark:text-orange-300">
                      A Receber
                    </span>
                    <span className="text-sm font-bold px-2 py-1 bg-orange-100 dark:bg-orange-900/50 rounded">
                      {contasVencidas.receber}
                    </span>
                  </div>
                  <div className="text-xl font-bold text-orange-600">
                    R$ {contasVencidas.totalReceber.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
            {incluirVencidas && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <p className="text-xs text-blue-800 dark:text-blue-300">
                  ℹ️ Estes valores estão incluídos nos cálculos acima
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Gráfico de Fluxo Semanal */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Fluxo de Caixa Semanal</CardTitle>
          <CardDescription>
            Projeção para as próximas {Math.ceil(diasProjecao / 7)} semanas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!temDados ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="font-medium">Dados insuficientes para gerar o gráfico</p>
              <p className="text-sm mt-2">Adicione contas a pagar e receber para visualizar o fluxo</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="semana" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="entrada" stroke="#10b981" name="Entrada" strokeWidth={2} />
                <Line type="monotone" dataKey="saida" stroke="#ef4444" name="Saída" strokeWidth={2} />
                <Line type="monotone" dataKey="saldo" stroke="#3b82f6" name="Saldo" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Despesas por Categoria */}
      {despesasPorCategoria.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Despesas Pendentes por Categoria</CardTitle>
            <CardDescription>Top 5 categorias de despesas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={despesasPorCategoria} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Resumo Detalhado */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Resumo Detalhado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Contas a Receber (Pendentes)</span>
              <span className="font-mono text-sm font-bold text-green-600">
                R$ {contasReceber.filter((c: any) => c.status === 'pendente').reduce((sum: number, c: any) => sum + (c.valor || 0), 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Contas a Pagar (Pendentes)</span>
              <span className="font-mono text-sm font-bold text-red-600">
                R$ {contasPagar.filter((c: any) => c.status === 'pendente').reduce((sum: number, c: any) => sum + (c.valor || 0), 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Total de Vendas (Mês Atual)</span>
              <span className="font-mono text-sm font-bold text-blue-600">
                R$ {vendas.filter((v: any) => {
                  if (!v.data) return false;
                  const vendaDate = new Date(v.data);
                  return vendaDate.getMonth() === hoje.getMonth() && vendaDate.getFullYear() === hoje.getFullYear();
                }).reduce((sum: number, v: any) => sum + (v.valor_total || 0), 0).toFixed(2)}
              </span>
            </div>
            {(contasVencidas.pagar > 0 || contasVencidas.receber > 0) && (
              <>
                <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900/50">
                  <span className="text-sm font-medium text-orange-800 dark:text-orange-300">Contas Vencidas a Pagar</span>
                  <span className="font-mono text-sm font-bold text-red-600">
                    R$ {contasVencidas.totalPagar.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900/50">
                  <span className="text-sm font-medium text-orange-800 dark:text-orange-300">Contas Vencidas a Receber</span>
                  <span className="font-mono text-sm font-bold text-orange-600">
                    R$ {contasVencidas.totalReceber.toFixed(2)}
                  </span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
