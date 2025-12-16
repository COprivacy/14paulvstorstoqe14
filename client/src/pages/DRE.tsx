import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TrendingUp, TrendingDown, DollarSign, HelpCircle, Info, BookOpen, Calculator, Target, AlertCircle, CheckCircle2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";

export default function DRE() {
  const [periodoFiltro, setPeriodoFiltro] = useState("trimestre");
  const [showGuide, setShowGuide] = useState(false);

  const { data: vendas = [], isLoading: loadingVendas } = useQuery({
    queryKey: ["/api/vendas"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/vendas");
        return response.json();
      } catch (error) {
        console.error("Erro ao buscar vendas:", error);
        return [];
      }
    },
  });

  const { data: contasPagar = [], isLoading: loadingContas } = useQuery({
    queryKey: ["/api/contas-pagar"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/contas-pagar");
        return response.json();
      } catch (error) {
        console.error("Erro ao buscar contas a pagar:", error);
        return [];
      }
    },
  });

  const isLoading = loadingVendas || loadingContas;

  const getDataRange = () => {
    const now = new Date();
    const startDate = new Date();
    
    switch (periodoFiltro) {
      case "mes":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "trimestre":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "semestre":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "ano":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 3);
    }
    
    return { startDate, endDate: now };
  };

  const { startDate, endDate } = getDataRange();

  const vendasFiltradas = vendas.filter((v: any) => {
    if (!v.data) return false;
    const vendaDate = new Date(v.data);
    return vendaDate >= startDate && vendaDate <= endDate;
  });

  const contasFiltradas = contasPagar.filter((c: any) => {
    if (!c.data_pagamento || c.status !== 'pago') return false;
    const pagamentoDate = new Date(c.data_pagamento);
    return pagamentoDate >= startDate && pagamentoDate <= endDate;
  });

  const receitaTotal = vendasFiltradas.reduce((sum: number, v: any) => sum + (v.valor_total || 0), 0);
  const despesasTotais = contasFiltradas.reduce((sum: number, c: any) => sum + (c.valor || 0), 0);
  const resultadoLiquido = receitaTotal - despesasTotais;

  const receitaBruta = receitaTotal;
  const deducoes = receitaTotal * 0.10;
  const receitaLiquida = receitaBruta - deducoes;
  const custoVendas = receitaBruta * 0.60;
  const lucroBruto = receitaLiquida - custoVendas;
  const despesasOperacionais = despesasTotais;
  const resultadoFinal = lucroBruto - despesasOperacionais;

  const margemBruta = receitaLiquida > 0 ? (lucroBruto / receitaLiquida) * 100 : 0;
  const margemLiquida = receitaLiquida > 0 ? (resultadoFinal / receitaLiquida) * 100 : 0;

  const getMonthsForPeriod = () => {
    const months = [];
    const now = new Date();
    let numMonths = 3;
    
    switch (periodoFiltro) {
      case "mes": numMonths = 1; break;
      case "trimestre": numMonths = 3; break;
      case "semestre": numMonths = 6; break;
      case "ano": numMonths = 12; break;
    }
    
    for (let i = numMonths - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(now.getMonth() - i);
      months.push(date);
    }
    return months;
  };

  const chartData = getMonthsForPeriod().map((date) => {
    const monthNum = date.getMonth();
    const yearNum = date.getFullYear();
    
    const receitaMes = vendas
      .filter((v: any) => {
        if (!v.data) return false;
        const vendaDate = new Date(v.data);
        return vendaDate.getMonth() === monthNum && vendaDate.getFullYear() === yearNum;
      })
      .reduce((sum: number, v: any) => sum + (v.valor_total || 0), 0);
    
    const despesasMes = contasPagar
      .filter((c: any) => {
        if (!c.data_pagamento || c.status !== 'pago') return false;
        const pagamentoDate = new Date(c.data_pagamento);
        return pagamentoDate.getMonth() === monthNum && pagamentoDate.getFullYear() === yearNum;
      })
      .reduce((sum: number, c: any) => sum + (c.valor || 0), 0);
    
    const lucroMes = receitaMes - despesasMes;
    
    return {
      mes: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
      receita: Number(receitaMes.toFixed(2)),
      despesas: Number(despesasMes.toFixed(2)),
      lucro: Number(lucroMes.toFixed(2)),
    };
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const DRELineItem = ({ 
    label, 
    value, 
    isNegative = false, 
    isBold = false, 
    indent = false,
    tooltip,
    testId
  }: {
    label: string;
    value: number;
    isNegative?: boolean;
    isBold?: boolean;
    indent?: boolean;
    tooltip?: string;
    testId?: string;
  }) => (
    <div className={`flex justify-between items-center py-3 border-b border-border/50 ${isBold ? 'bg-muted/30' : ''}`}>
      <div className="flex items-center gap-2">
        {indent && <span className="w-4" />}
        <span className={`${isBold ? 'font-bold' : 'text-muted-foreground'} ${indent ? 'text-sm' : ''}`}>
          {isNegative && indent && '(-) '}
          {label}
        </span>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <span 
        className={`font-mono ${isNegative ? 'text-red-600 dark:text-red-400' : ''} ${isBold ? 'font-bold text-lg' : ''} ${!isNegative && isBold && value >= 0 ? 'text-green-600 dark:text-green-400' : ''} ${!isNegative && isBold && value < 0 ? 'text-red-600 dark:text-red-400' : ''}`}
        data-testid={testId}
      >
        {formatCurrency(Math.abs(value))}
      </span>
    </div>
  );

  const IndicatorCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    color = "blue"
  }: {
    title: string;
    value: string;
    subtitle: string;
    icon: any;
    trend?: "up" | "down" | "neutral";
    color?: "green" | "red" | "blue" | "yellow";
  }) => {
    const colorClasses = {
      green: "text-green-600 dark:text-green-400",
      red: "text-red-600 dark:text-red-400",
      blue: "text-blue-600 dark:text-blue-400",
      yellow: "text-yellow-600 dark:text-yellow-400"
    };

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="flex items-center gap-1">
            {trend === "up" && <ArrowUpRight className="h-4 w-4 text-green-600" />}
            {trend === "down" && <ArrowDownRight className="h-4 w-4 text-red-600" />}
            <Icon className={`h-4 w-4 ${colorClasses[color]}`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${colorClasses[color]}`} data-testid={`text-${title.toLowerCase().replace(/\s/g, '-')}`}>
            {value}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold">DRE - Demonstrativo de Resultados</h1>
            <Dialog open={showGuide} onOpenChange={setShowGuide}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" data-testid="button-open-guide">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Guia de Uso - DRE
                  </DialogTitle>
                  <DialogDescription>
                    Aprenda a interpretar e utilizar o Demonstrativo de Resultados do Exercício
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 mt-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <Calculator className="h-4 w-4 text-primary" />
                          O que é o DRE?
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        <p className="mb-2">
                          O <strong>Demonstrativo de Resultados do Exercício (DRE)</strong> é um relatório contábil que apresenta 
                          de forma resumida as operações realizadas pela empresa durante um período.
                        </p>
                        <p>
                          Ele mostra se a empresa teve lucro ou prejuízo, detalhando todas as receitas, custos e despesas.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-primary" />
                          Como interpretar cada linha?
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-3">
                        <div>
                          <strong className="text-foreground">Receita Bruta:</strong>
                          <p>Total de vendas realizadas no período, antes de qualquer dedução.</p>
                        </div>
                        <div>
                          <strong className="text-foreground">Deduções:</strong>
                          <p>Impostos sobre vendas (ICMS, PIS, COFINS) e devoluções. Aqui usamos 10% como estimativa.</p>
                        </div>
                        <div>
                          <strong className="text-foreground">Receita Líquida:</strong>
                          <p>Receita Bruta menos as deduções. É o que efetivamente entra no caixa.</p>
                        </div>
                        <div>
                          <strong className="text-foreground">Custo das Vendas (CMV):</strong>
                          <p>Custos diretamente ligados aos produtos vendidos (compra de mercadorias, matéria-prima). Usamos 60% como referência.</p>
                        </div>
                        <div>
                          <strong className="text-foreground">Lucro Bruto:</strong>
                          <p>Receita Líquida menos o CMV. Mostra o ganho antes das despesas operacionais.</p>
                        </div>
                        <div>
                          <strong className="text-foreground">Despesas Operacionais:</strong>
                          <p>Gastos para manter a empresa funcionando (aluguel, salários, energia, etc). Calculado com base nas contas pagas.</p>
                        </div>
                        <div>
                          <strong className="text-foreground">Resultado Líquido:</strong>
                          <p>O lucro ou prejuízo final após todas as deduções. Verde = lucro, Vermelho = prejuízo.</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          O que são as Margens?
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-3">
                        <div>
                          <strong className="text-foreground">Margem Bruta:</strong>
                          <p>Percentual do lucro bruto em relação à receita líquida. Indica a eficiência na produção/compra de produtos.</p>
                          <p className="mt-1 text-sm">Referência: acima de 30% é considerado bom para comércio.</p>
                        </div>
                        <div>
                          <strong className="text-foreground">Margem Líquida:</strong>
                          <p>Percentual do lucro líquido em relação à receita líquida. Mostra quanto sobra de cada real vendido.</p>
                          <p className="mt-1 text-sm">Referência: acima de 10% indica boa saúde financeira.</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-primary" />
                          Dicas Importantes
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-3">
                        <div className="flex gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                          <p>Use o filtro de período para analisar diferentes intervalos de tempo.</p>
                        </div>
                        <div className="flex gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                          <p>Compare os resultados mês a mês no gráfico para identificar tendências.</p>
                        </div>
                        <div className="flex gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                          <p>Fique atento às margens: quedas constantes podem indicar problemas.</p>
                        </div>
                        <div className="flex gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                          <p>Mantenha as contas a pagar atualizadas para um DRE mais preciso.</p>
                        </div>
                        <div className="flex gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                          <p>Passe o mouse sobre o ícone de informação para ver explicações de cada item.</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Nota:</strong> Os percentuais de deduções (10%) e custo de vendas (60%) 
                      são estimativas padrão. Para um DRE mais preciso, recomendamos cadastrar 
                      seus custos reais no sistema.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-muted-foreground mt-1">Análise financeira completa do seu negócio</p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={periodoFiltro} onValueChange={setPeriodoFiltro}>
            <SelectTrigger className="w-[160px]" data-testid="select-periodo">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mes">Último Mês</SelectItem>
              <SelectItem value="trimestre">Último Trimestre</SelectItem>
              <SelectItem value="semestre">Último Semestre</SelectItem>
              <SelectItem value="ano">Último Ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted animate-pulse rounded w-24" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted animate-pulse rounded w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <IndicatorCard
            title="Receita Total"
            value={formatCurrency(receitaTotal)}
            subtitle={`${vendasFiltradas.length} vendas no período`}
            icon={TrendingUp}
            color="green"
            trend={receitaTotal > 0 ? "up" : "neutral"}
          />
          <IndicatorCard
            title="Despesas Totais"
            value={formatCurrency(despesasTotais)}
            subtitle={`${contasFiltradas.length} contas pagas`}
            icon={TrendingDown}
            color="red"
            trend={despesasTotais > 0 ? "down" : "neutral"}
          />
          <IndicatorCard
            title="Resultado Líquido"
            value={formatCurrency(resultadoLiquido)}
            subtitle={resultadoLiquido >= 0 ? "Lucro no período" : "Prejuízo no período"}
            icon={DollarSign}
            color={resultadoLiquido >= 0 ? "blue" : "red"}
            trend={resultadoLiquido >= 0 ? "up" : "down"}
          />
          <IndicatorCard
            title="Margem Líquida"
            value={`${margemLiquida.toFixed(1)}%`}
            subtitle={margemLiquida >= 10 ? "Margem saudável" : margemLiquida >= 0 ? "Margem baixa" : "Margem negativa"}
            icon={Target}
            color={margemLiquida >= 10 ? "green" : margemLiquida >= 0 ? "yellow" : "red"}
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <div>
                <CardTitle>Evolução Financeira</CardTitle>
                <CardDescription>Receitas, despesas e lucro ao longo do tempo</CardDescription>
              </div>
              <Badge variant="outline" className="shrink-0">
                {periodoFiltro === "mes" ? "1 mês" : periodoFiltro === "trimestre" ? "3 meses" : periodoFiltro === "semestre" ? "6 meses" : "12 meses"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="mes" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(value) => `R$${(value/1000).toFixed(0)}k`} />
                  <RechartsTooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="receita" stroke="#22c55e" fillOpacity={1} fill="url(#colorReceita)" strokeWidth={2} name="Receita" />
                  <Area type="monotone" dataKey="despesas" stroke="#ef4444" fillOpacity={1} fill="url(#colorDespesas)" strokeWidth={2} name="Despesas" />
                  <Line type="monotone" dataKey="lucro" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" name="Lucro" dot={{ fill: '#3b82f6' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <div>
                <CardTitle>Indicadores de Performance</CardTitle>
                <CardDescription>Métricas chave do seu negócio</CardDescription>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clique no botão de ajuda para mais detalhes</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Margem Bruta</span>
                <span className="text-sm font-bold">{margemBruta.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${margemBruta >= 30 ? 'bg-green-500' : margemBruta >= 15 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(Math.max(margemBruta, 0), 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Meta: acima de 30% {margemBruta >= 30 && <CheckCircle2 className="inline h-3 w-3 text-green-500" />}
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Margem Líquida</span>
                <span className="text-sm font-bold">{margemLiquida.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${margemLiquida >= 10 ? 'bg-green-500' : margemLiquida >= 5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(Math.max(margemLiquida, 0), 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Meta: acima de 10% {margemLiquida >= 10 && <CheckCircle2 className="inline h-3 w-3 text-green-500" />}
              </p>
            </div>

            <div className="pt-4 border-t space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Ticket Médio</span>
                <span className="font-mono font-medium">
                  {vendasFiltradas.length > 0 ? formatCurrency(receitaTotal / vendasFiltradas.length) : 'R$ 0,00'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Custo Médio por Conta</span>
                <span className="font-mono font-medium">
                  {contasFiltradas.length > 0 ? formatCurrency(despesasTotais / contasFiltradas.length) : 'R$ 0,00'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Relação Receita/Despesa</span>
                <span className="font-mono font-medium">
                  {despesasTotais > 0 ? (receitaTotal / despesasTotais).toFixed(2) : '-'}x
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle>Demonstração do Resultado do Exercício</CardTitle>
              <CardDescription>Estrutura detalhada do DRE - {periodoFiltro === "mes" ? "Último Mês" : periodoFiltro === "trimestre" ? "Último Trimestre" : periodoFiltro === "semestre" ? "Último Semestre" : "Último Ano"}</CardDescription>
            </div>
            <Badge variant={resultadoFinal >= 0 ? "default" : "destructive"}>
              {resultadoFinal >= 0 ? "Lucro" : "Prejuízo"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <DRELineItem 
              label="Receita Bruta de Vendas" 
              value={receitaBruta} 
              isBold 
              tooltip="Soma total de todas as vendas realizadas no período, sem nenhuma dedução."
              testId="text-receita-bruta"
            />
            <DRELineItem 
              label="Deduções da Receita (Impostos ~10%)" 
              value={deducoes} 
              isNegative 
              indent
              tooltip="Impostos incidentes sobre vendas como ICMS, PIS, COFINS e devoluções. Usamos 10% como estimativa padrão."
              testId="text-deducoes"
            />
            <DRELineItem 
              label="Receita Líquida de Vendas" 
              value={receitaLiquida} 
              isBold
              tooltip="Receita Bruta menos as deduções. É o valor que efetivamente entra na empresa."
              testId="text-receita-liquida"
            />
            <DRELineItem 
              label="Custo das Mercadorias Vendidas (CMV ~60%)" 
              value={custoVendas} 
              isNegative 
              indent
              tooltip="Custos diretamente relacionados aos produtos vendidos: compra de mercadorias, matéria-prima, etc. Usamos 60% como referência do setor."
              testId="text-custo-vendas"
            />
            <DRELineItem 
              label="Lucro Bruto" 
              value={lucroBruto} 
              isBold
              tooltip="Receita Líquida menos o CMV. Representa o ganho obtido antes das despesas operacionais."
              testId="text-lucro-bruto"
            />
            <DRELineItem 
              label="Despesas Operacionais" 
              value={despesasOperacionais} 
              isNegative 
              indent
              tooltip="Todas as despesas necessárias para manter a empresa funcionando: aluguel, salários, energia, água, etc. Calculado com base nas contas pagas no período."
              testId="text-despesas-operacionais"
            />
            <div className="mt-4 pt-4 border-t-2 border-primary/20">
              <DRELineItem 
                label="Resultado Líquido do Exercício" 
                value={resultadoFinal} 
                isBold
                tooltip="Lucro ou prejuízo final após todas as deduções. Verde indica lucro, vermelho indica prejuízo."
                testId="text-dre-resultado-final"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button variant="outline" onClick={() => setShowGuide(true)} data-testid="button-open-guide-bottom">
          <BookOpen className="h-4 w-4 mr-2" />
          Precisa de ajuda? Veja o guia completo
        </Button>
      </div>
    </div>
  );
}
