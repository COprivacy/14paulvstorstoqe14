import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { formatDateTime } from "@/lib/dateUtils";
import { validateVenda, validateArray } from "@/lib/dataValidator";

interface Sale {
  id: number;
  produto: string;
  quantidade_vendida: number;
  valor_total: number;
  data: string;
  forma_pagamento?: string;
  itens?: string;
  cliente_id?: number;
  orcamento_numero?: string;
}

interface SalesTableProps {
  sales: Sale[];
}

export default function SalesTable({ sales }: SalesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Buscar devoluções para vincular às vendas
  const { data: devolucoes = [] } = useQuery({
    queryKey: ["/api/devolucoes"],
    refetchInterval: 10000, // Auto-refresh a cada 10 segundos
  });

  // Validar e sanitizar dados de vendas
  const { valid: validSales } = validateArray<Sale>(sales, validateVenda);

  // Ordenar vendas por data decrescente (mais recentes primeiro)
  const sortedSales = [...validSales].sort((a, b) => {
    try {
      const dateA = new Date(a.data || 0).getTime();
      const dateB = new Date(b.data || 0).getTime();
      return dateB - dateA;
    } catch (error) {
      console.error('Erro ao ordenar vendas:', error);
      return 0;
    }
  });

  const totalPages = Math.ceil(sortedSales.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSales = sortedSales.slice(startIndex, endIndex);

  return (
    <Card className="border-0 bg-gradient-to-br from-card/80 to-card backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          Histórico de Vendas
        </CardTitle>
        <CardDescription>
          {sales.length > 0 ? `${sales.length} venda(s) registrada(s)` : "Nenhuma venda registrada ainda"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sales.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <ShoppingCart className="mx-auto h-12 w-12 opacity-50 mb-4" />
            <p>Nenhuma venda registrada ainda</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto(s)</TableHead>
                    <TableHead className="text-center">Quantidade</TableHead>
                    <TableHead className="text-right">Valor Total</TableHead>
                    <TableHead className="text-center">Forma de Pagamento</TableHead>
                    <TableHead className="text-center">Vendedor</TableHead>
                    <TableHead className="text-center">Orçamento</TableHead>
                    <TableHead className="text-center">Devolução</TableHead>
                    <TableHead className="text-right">Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentSales.map((sale: any) => {
                    let formaPagamento = 'Dinheiro';
                    if (sale.forma_pagamento === 'cartao_credito') formaPagamento = 'Cartão Crédito';
                    else if (sale.forma_pagamento === 'cartao_debito') formaPagamento = 'Cartão Débito';
                    else if (sale.forma_pagamento === 'pix') formaPagamento = 'PIX';
                    else if (sale.forma_pagamento === 'boleto') formaPagamento = 'Boleto';

                    // Verificar se existe devolução relacionada a esta venda
                    const devolucaoRelacionada = devolucoes.find((d: any) => 
                      d.venda_id === sale.id && d.status === 'aprovada'
                    );

                    return (
                      <TableRow key={sale.id} className={devolucaoRelacionada ? 'bg-red-50 dark:bg-red-950/10' : ''}>
                        <TableCell className="max-w-[300px] truncate" title={sale.produto || 'N/A'}>
                          <div className="flex items-center gap-2">
                            {sale.produto || 'N/A'}
                            {devolucaoRelacionada && (
                              <Badge variant="destructive" className="text-xs">
                                Devolvido
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{sale.quantidade_vendida || 0}</TableCell>
                        <TableCell className="text-right font-semibold text-green-600">
                          R$ {(sale.valor_total || 0).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="whitespace-nowrap">
                            {formaPagamento}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {sale.vendedor || 'Venda direta'}
                        </TableCell>
                        <TableCell className="text-center">
                          {sale.orcamento_numero ? (
                            <Badge variant="secondary" className="whitespace-nowrap">
                              {sale.orcamento_numero}
                            </Badge>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {devolucaoRelacionada ? (
                            <Badge variant="destructive" className="whitespace-nowrap" title={`Devolvido ${devolucaoRelacionada.quantidade} un. - R$ ${devolucaoRelacionada.valor_total.toFixed(2)}`}>
                              Devolvido
                            </Badge>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          {sale.data ? formatDateTime(sale.data) : 'N/A'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-4 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span>
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}