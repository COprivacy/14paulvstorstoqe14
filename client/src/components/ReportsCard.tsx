import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, ArrowDownCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ReportsCardProps {
  dailyTotal?: number;
  weeklyTotal?: number;
  monthlyTotal?: number;
  dailyReturns?: number; // Devoluções do dia
  weeklyReturns?: number; // Devoluções da semana
  monthlyReturns?: number; // Devoluções do mês
  onFilter?: (startDate: string, endDate: string) => void;
  onClearFilter?: () => void;
  isFiltered?: boolean;
}

export default function ReportsCard({
  dailyTotal = 0,
  weeklyTotal = 0,
  monthlyTotal = 0,
  dailyReturns = 0,
  weeklyReturns = 0,
  monthlyReturns = 0,
  onFilter,
  onClearFilter,
  isFiltered = false
}: ReportsCardProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFilter = () => {
    if (startDate && endDate) {
      onFilter?.(startDate, endDate);
      console.log("Filtrar vendas:", { startDate, endDate });
    }
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    onClearFilter?.();
    console.log("Filtro limpo");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ArrowDownCircle className="h-4 w-4 text-green-600" />
              Vendas Hoje
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ArrowDownCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Valor já descontadas devoluções aprovadas</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600" data-testid="text-daily-total">
              R$ {dailyTotal.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ArrowDownCircle className="h-4 w-4 text-green-600" />
              Vendas da Semana
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ArrowDownCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Valor já descontadas devoluções aprovadas</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600" data-testid="text-weekly-total">
              R$ {weeklyTotal.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ArrowDownCircle className="h-4 w-4 text-green-600" />
              Vendas Mensais
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ArrowDownCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Valor já descontadas devoluções aprovadas</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600" data-testid="text-monthly-total">
              R$ {monthlyTotal.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ArrowDownCircle className="h-4 w-4 text-red-600" />
              Devoluções Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600" data-testid="text-daily-returns">
              R$ {dailyReturns.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ArrowDownCircle className="h-4 w-4 text-red-600" />
              Devoluções da Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600" data-testid="text-weekly-returns">
              R$ {weeklyReturns.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ArrowDownCircle className="h-4 w-4 text-red-600" />
              Devoluções Mensais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600" data-testid="text-monthly-returns">
              R$ {monthlyReturns.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtrar por Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Data Inicial</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-10"
                    data-testid="input-start-date"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">Data Final</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-10"
                    data-testid="input-end-date"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleFilter}
                className="flex-1 md:flex-none"
                disabled={!startDate || !endDate}
                data-testid="button-filter"
              >
                Aplicar Filtro
              </Button>
              {(startDate || endDate) && (
                <Button
                  onClick={handleClearFilter}
                  variant="outline"
                  className="flex-1 md:flex-none"
                  data-testid="button-clear-filter"
                >
                  Limpar Filtro
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}