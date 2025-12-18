import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ShoppingCart, Download, FileText } from "lucide-react";
import { formatDateTime } from "@/lib/dateUtils";
import { validateVenda, validateArray } from "@/lib/dataValidator";
import jsPDF from "jspdf";

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
  status?: string;
  cupom_texto?: string;
}

interface SalesTableProps {
  sales: Sale[];
}

const downloadCupomPDF = (cupomTexto: string, vendaId: number) => {
  try {
    const doc = new jsPDF({
      format: 'a4',
      orientation: 'portrait',
    });

    // Configurações do documento
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    // Processar o texto do cupom linha por linha
    const linhas = cupomTexto.split('\n');
    let yPosition = 20;
    const maxWidth = 180;
    const lineHeight = 5;
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;

    // Centralizar cada linha
    linhas.forEach((linha) => {
      if (yPosition + lineHeight > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }

      // Se a linha for longa, quebrar em múltiplas linhas
      const splitText = doc.splitTextToSize(linha, maxWidth);
      splitText.forEach((texto: string) => {
        doc.text(texto, doc.internal.pageSize.getWidth() / 2, yPosition, { align: 'center' });
        yPosition += lineHeight;
      });
    });

    // Salvar PDF
    doc.save(`cupom-venda-${vendaId}.pdf`);
  } catch (error) {
    console.error('Erro ao gerar PDF do cupom:', error);
    // Fallback para download de texto se houver erro
    const blob = new Blob([cupomTexto], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cupom-venda-${vendaId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

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
                    <TableHead className="text-center">Cupom</TableHead>
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
                    // Normalizar tipos para comparação (venda_id pode vir como string do PostgreSQL)
                    const devolucaoRelacionada = devolucoes.find((d: any) => 
                      Number(d.venda_id) === Number(sale.id) && d.status === 'aprovada'
                    );

                    return (
                      <TableRow 
                        key={sale.id} 
                        className={sale.status === "arquivada" ? "opacity-60 bg-muted/30" : ""}
                      >
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
                            <div className="flex flex-col gap-1 items-center">
                              <Badge variant="destructive" className="text-xs">
                                Sim
                              </Badge>
                              <Badge variant="outline" className="font-mono text-xs text-blue-600">
                                DEV-{devolucaoRelacionada.id}
                              </Badge>
                            </div>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {sale.cupom_texto ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => downloadCupomPDF(sale.cupom_texto || '', sale.id)}
                              data-testid={`button-download-cupom-${sale.id}`}
                              title="Baixar cupom em PDF"
                            >
                              <FileText className="h-4 w-4 text-blue-600" />
                            </Button>
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