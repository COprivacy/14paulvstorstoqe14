
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, ShoppingCart, Plus, Minus, DollarSign, User, Check, ChevronsUpDown, CreditCard, Banknote, Percent, Scale, X, HelpCircle, Keyboard } from "lucide-react";
import { Label } from "@/components/ui/label";
import type { Cliente } from "@shared/schema";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface CartItem {
  id: number;
  nome: string;
  codigo_barras: string;
  preco: number;
  quantidade: number;
  subtotal: number;
  estoque_disponivel: number;
  peso?: number;
}

interface PDVScannerProps {
  onSaleComplete?: (sale: { itens: { codigo_barras: string; quantidade: number }[]; valorTotal: number; cliente_id?: number; forma_pagamento?: string }) => void;
  onProductNotFound?: (barcode: string) => void;
  onFetchProduct?: (barcode: string) => Promise<any>;
}

export default function PDVScanner({ onSaleComplete, onProductNotFound, onFetchProduct }: PDVScannerProps) {
  const { toast } = useToast();
  const [barcode, setBarcode] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lastScanTime, setLastScanTime] = useState(0);
  const [valorPago, setValorPago] = useState("");
  const [clienteId, setClienteId] = useState<string>("none");
  const [openCombobox, setOpenCombobox] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [descontoPercentual, setDescontoPercentual] = useState(0);
  const [formaPagamento, setFormaPagamento] = useState<string>("dinheiro");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBalancaDialog, setShowBalancaDialog] = useState(false);
  const [pesoBalanca, setPesoBalanca] = useState("");
  const [quantidadeMultiplicador, setQuantidadeMultiplicador] = useState(1);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Lista de atalhos para exibir no popup de ajuda
  const shortcuts = [
    { key: "F1", action: "Ajuda", description: "Mostra este popup de atalhos", icon: HelpCircle },
    { key: "F2", action: "Dinheiro", description: "Seleciona pagamento em dinheiro", icon: Banknote },
    { key: "F3", action: "Debito", description: "Seleciona cartao de debito", icon: CreditCard },
    { key: "F4", action: "Credito", description: "Seleciona cartao de credito", icon: CreditCard },
    { key: "F5", action: "PIX", description: "Seleciona pagamento via PIX", icon: DollarSign },
    { key: "F6", action: "Limpar Carrinho", description: "Remove todos os itens do carrinho", icon: Trash2 },
    { key: "F7", action: "Focar Scanner", description: "Foca no campo de codigo de barras", icon: ShoppingCart },
    { key: "F8", action: "Balanca", description: "Abre dialog para informar peso", icon: Scale },
    { key: "F9", action: "Remover Ultimo", description: "Remove o ultimo item do carrinho", icon: X },
    { key: "F10", action: "Multiplicar +1", description: "Aumenta multiplicador de quantidade", icon: Plus },
    { key: "F11", action: "Multiplicar -1", description: "Diminui multiplicador de quantidade", icon: Minus },
    { key: "F12", action: "Finalizar Venda", description: "Abre tela de finalizacao da venda", icon: Check },
    { key: "ESC", action: "Limpar Campo", description: "Limpa o campo de busca", icon: X },
  ];

  const { data: clientes = [] } = useQuery<Cliente[]>({
    queryKey: ["/api/clientes"],
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Atalhos de teclado para facilitar o uso do operador
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignora se estiver digitando em um input (exceto para F1 que sempre abre ajuda)
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      // F1 - Ajuda (sempre funciona)
      if (e.key === 'F1') {
        e.preventDefault();
        setShowHelpDialog(true);
      }
      // F2 - Dinheiro
      if (e.key === 'F2') {
        e.preventDefault();
        setFormaPagamento('dinheiro');
        toast({ title: "Dinheiro selecionado", description: "Atalho F2" });
      }
      // F3 - Cartão Débito
      if (e.key === 'F3') {
        e.preventDefault();
        setFormaPagamento('cartao_debito');
        toast({ title: "Cartao Debito selecionado", description: "Atalho F3" });
      }
      // F4 - Cartão Crédito
      if (e.key === 'F4') {
        e.preventDefault();
        setFormaPagamento('cartao_credito');
        toast({ title: "Cartao Credito selecionado", description: "Atalho F4" });
      }
      // F5 - PIX
      if (e.key === 'F5') {
        e.preventDefault();
        setFormaPagamento('pix');
        toast({ title: "PIX selecionado", description: "Atalho F5" });
      }
      // F6 - Limpar carrinho
      if (e.key === 'F6') {
        e.preventDefault();
        if (cart.length > 0) {
          clearCart();
          toast({ title: "Carrinho limpo", description: "Atalho F6" });
        }
      }
      // F7 - Focar no campo de código de barras
      if (e.key === 'F7') {
        e.preventDefault();
        inputRef.current?.focus();
        toast({ title: "Scanner ativado", description: "Atalho F7" });
      }
      // F8 - Balança
      if (e.key === 'F8') {
        e.preventDefault();
        setShowBalancaDialog(true);
        toast({ title: "Balanca aberta", description: "Atalho F8" });
      }
      // F9 - Remover último item
      if (e.key === 'F9') {
        e.preventDefault();
        if (cart.length > 0) {
          removeItem(cart.length - 1);
          toast({ title: "Ultimo item removido", description: "Atalho F9" });
        }
      }
      // F10 - Aumentar quantidade multiplicador
      if (e.key === 'F10') {
        e.preventDefault();
        setQuantidadeMultiplicador(prev => prev + 1);
        toast({ title: `Quantidade: ${quantidadeMultiplicador + 1}`, description: "Atalho F10" });
      }
      // F11 - Diminuir quantidade multiplicador
      if (e.key === 'F11') {
        e.preventDefault();
        setQuantidadeMultiplicador(prev => Math.max(1, prev - 1));
        toast({ title: `Quantidade: ${Math.max(1, quantidadeMultiplicador - 1)}`, description: "Atalho F11" });
      }
      // F12 - Finalizar venda
      if (e.key === 'F12') {
        e.preventDefault();
        if (cart.length > 0 && !isProcessing) {
          handleCompleteSale();
        }
      }
      // ESC - Limpar campo de busca / Fechar dialogs
      if (e.key === 'Escape' && !isTyping) {
        e.preventDefault();
        setBarcode("");
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, isProcessing, quantidadeMultiplicador, formaPagamento]);

  useEffect(() => {
    // Apenas processa automaticamente se o código for longo (código de barras padrão)
    // Para códigos curtos, o operador deve pressionar Enter
    if (barcode.length >= 12) {
      handleScan(barcode);
    }
  }, [barcode]);

  const subtotalSemDesconto = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const valorDesconto = subtotalSemDesconto * (descontoPercentual / 100);
  const valorTotal = subtotalSemDesconto - valorDesconto;
  const troco = parseFloat(valorPago || "0") - valorTotal;

  const playBeep = (success: boolean = true) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = success ? 1200 : 400;
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const fetchProduct = async (barcode: string) => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;

      const user = JSON.parse(userStr);
      const headers: Record<string, string> = {
        "x-user-id": user.id,
        "x-user-type": user.tipo || "usuario",
      };

      if (user.tipo === "funcionario" && user.conta_id) {
        headers["x-conta-id"] = user.conta_id;
      }

      const response = await fetch(`/api/produtos/codigo/${barcode}`, { headers });
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      return null;
    }
  };

  const handleScan = async (scannedBarcode: string) => {
    if (!scannedBarcode.trim() || isProcessing) return;

    const now = Date.now();
    if (now - lastScanTime < 100) return;
    
    setLastScanTime(now);
    setIsProcessing(true);

    try {
      const isBalancaCode = scannedBarcode.startsWith('2') && scannedBarcode.length === 13;
      
      let codigoProduto = scannedBarcode;
      let pesoGramas = 0;
      
      if (isBalancaCode) {
        codigoProduto = scannedBarcode.substring(1, 7);
        pesoGramas = parseInt(scannedBarcode.substring(7, 12));
        const pesoKg = pesoGramas / 1000;
        
        toast({
          title: "🎯 Produto pesado detectado",
          description: `Peso: ${pesoKg.toFixed(3)} kg`,
        });
      }

      const produto = onFetchProduct
        ? await onFetchProduct(codigoProduto)
        : await fetchProduct(codigoProduto);

      if (!produto) {
        playBeep(false);
        onProductNotFound?.(scannedBarcode);
        setBarcode("");
        setIsProcessing(false);
        return;
      }

      playBeep(true);

      const existingItemIndex = cart.findIndex(item => item.codigo_barras === codigoProduto);
      const quantidadeAdicionar = isBalancaCode ? (pesoGramas / 1000) : Math.max(1, quantidadeMultiplicador);

      if (existingItemIndex > -1) {
        const updatedCart = [...cart];
        const existingItem = updatedCart[existingItemIndex];
        const newQuantity = existingItem.quantidade + quantidadeAdicionar;
        
        if (newQuantity > existingItem.estoque_disponivel && !isBalancaCode) {
          toast({
            title: "⚠️ Estoque insuficiente",
            description: "Quantidade máxima atingida",
            variant: "destructive",
          });
          setIsProcessing(false);
          return;
        }
        
        updatedCart[existingItemIndex] = {
          ...existingItem,
          quantidade: newQuantity,
          subtotal: newQuantity * existingItem.preco,
          peso: isBalancaCode ? pesoGramas / 1000 : undefined
        };
        setCart(updatedCart);
      } else {
        setCart([...cart, {
          id: produto.id,
          nome: produto.nome,
          codigo_barras: codigoProduto,
          preco: produto.preco,
          quantidade: quantidadeAdicionar,
          subtotal: produto.preco * quantidadeAdicionar,
          estoque_disponivel: produto.quantidade,
          peso: isBalancaCode ? pesoGramas / 1000 : undefined
        }]);
      }

      setBarcode("");
      setQuantidadeMultiplicador(1); // Resetar multiplicador
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (error) {
      console.error("Erro ao processar código de barras:", error);
      playBeep(false);
      setBarcode("");
    } finally {
      setIsProcessing(false);
    }
  };

  

  const handleBalancaInput = () => {
    if (!pesoBalanca || parseFloat(pesoBalanca) <= 0) {
      toast({
        title: "⚠️ Peso inválido",
        description: "Digite um peso válido",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "⚖️ Peso registrado",
      description: `${parseFloat(pesoBalanca).toFixed(3)} kg`,
    });
    
    setPesoBalanca("");
    setShowBalancaDialog(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isProcessing) {
      e.preventDefault();
      handleScan(barcode);
    }
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    setCart(cart.map((item, i) => {
      if (i === index) {
        const quantity = Math.max(0.001, Math.min(newQuantity, item.estoque_disponivel));
        return {
          ...item,
          quantidade: quantity,
          subtotal: quantity * item.preco
        };
      }
      return item;
    }));
  };

  const removeItem = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleCompleteSale = () => {
    if (cart.length === 0) {
      toast({
        title: "⚠️ Carrinho vazio",
        description: "Adicione produtos antes de finalizar",
        variant: "destructive",
      });
      return;
    }

    if (formaPagamento === 'dinheiro') {
      const valorPagoNum = parseFloat(valorPago || "0");
      if (valorPagoNum < valorTotal) {
        toast({
          title: "⚠️ Valor insuficiente",
          description: "O valor pago é menor que o total",
          variant: "destructive",
        });
        return;
      }
    }

    setShowConfirmDialog(true);
  };

  const confirmSale = () => {
    if (isProcessing) return;
    
    setIsProcessing(true);

    const itens = cart.map(item => ({
      codigo_barras: item.codigo_barras,
      quantidade: item.quantidade
    }));

    const saleData: { itens: typeof itens; valorTotal: number; cliente_id?: number; forma_pagamento?: string } = {
      itens,
      valorTotal,
      forma_pagamento: formaPagamento
    };

    if (clienteId && clienteId !== "none") {
      saleData.cliente_id = parseInt(clienteId);
    }

    onSaleComplete?.(saleData);
    clearCart();
    setIsProcessing(false);
  };

  const clearCart = () => {
    setCart([]);
    setBarcode("");
    setValorPago("");
    setClienteId("none");
    setDescontoPercentual(0);
    setFormaPagamento("dinheiro");
    setQuantidadeMultiplicador(1);
    setShowConfirmDialog(false);
    setIsProcessing(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleValorPagoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isProcessing) {
      e.preventDefault();
      handleCompleteSale();
    }
  };

  useEffect(() => {
    if (clienteId !== "none") {
      const clienteSelecionado = clientes.find(c => c.id.toString() === clienteId);
      if (clienteSelecionado && clienteSelecionado.percentual_desconto) {
        setDescontoPercentual(clienteSelecionado.percentual_desconto);
      } else {
        setDescontoPercentual(0);
      }
    } else {
      setDescontoPercentual(0);
    }
  }, [clienteId, clientes]);

  

  return (
    <div className="flex flex-col h-full gap-2">
      {/* Header com Scanner e Ações Rápidas */}
      <div className="flex gap-2">
        <Card className="flex-1 shadow-md">
          <CardContent className="p-3">
            <div className="flex gap-2">
              <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 border">
                <span className="text-sm font-medium whitespace-nowrap">Qtd:</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQuantidadeMultiplicador(Math.max(1, quantidadeMultiplicador - 1))}
                  disabled={isProcessing || quantidadeMultiplicador <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  value={quantidadeMultiplicador === 0 ? "" : quantidadeMultiplicador}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || val === "0") {
                      setQuantidadeMultiplicador(0);
                    } else {
                      const parsed = parseInt(val);
                      if (!isNaN(parsed) && parsed > 0) {
                        setQuantidadeMultiplicador(parsed);
                      }
                    }
                  }}
                  onBlur={() => {
                    if (quantidadeMultiplicador < 1) {
                      setQuantidadeMultiplicador(1);
                    }
                  }}
                  className="h-8 w-16 text-center font-bold"
                  disabled={isProcessing}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQuantidadeMultiplicador(quantidadeMultiplicador + 1)}
                  disabled={isProcessing}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="🔍 Código de barras ou digite manualmente..."
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-10 text-base font-mono"
                  autoComplete="off"
                  disabled={isProcessing}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={() => setShowBalancaDialog(true)}
                title="Balança"
              >
                <Scale className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <p>Use um leitor de codigo de barras USB ou digite manualmente</p>
              <div className="flex items-center gap-3 flex-wrap">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowHelpDialog(true)}
                  className="gap-2"
                  data-testid="btn-show-help"
                >
                  <Keyboard className="h-4 w-4" />
                  <span className="font-mono">F1</span> Ajuda
                </Button>
                <span className="bg-muted px-2 py-1 rounded font-mono">F2</span><span>Dinheiro</span>
                <span className="bg-muted px-2 py-1 rounded font-mono">F3</span><span>Debito</span>
                <span className="bg-muted px-2 py-1 rounded font-mono">F4</span><span>Credito</span>
                <span className="bg-muted px-2 py-1 rounded font-mono">F5</span><span>PIX</span>
                <span className="bg-muted px-2 py-1 rounded font-mono">F12</span><span>Finalizar</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-72 shadow-md">
          <CardContent className="p-3">
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between h-10"
                  disabled={isProcessing}
                >
                  <User className="h-4 w-4 mr-2" />
                  {clienteId === "none"
                    ? "Cliente"
                    : clientes.find((c) => c.id.toString() === clienteId)?.nome || "Cliente"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-0">
                <Command>
                  <CommandInput placeholder="Buscar cliente..." />
                  <CommandList>
                    <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="none"
                        onSelect={() => {
                          setClienteId("none");
                          setOpenCombobox(false);
                        }}
                      >
                        <Check className={cn("mr-2 h-4 w-4", clienteId === "none" ? "opacity-100" : "opacity-0")} />
                        Sem cliente
                      </CommandItem>
                      {clientes.map((cliente) => (
                        <CommandItem
                          key={cliente.id}
                          value={cliente.id.toString()}
                          onSelect={(currentValue) => {
                            setClienteId(currentValue);
                            setOpenCombobox(false);
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", clienteId === cliente.id.toString() ? "opacity-100" : "opacity-0")} />
                          {cliente.nome}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>
      </div>

      {/* Área Principal - Carrinho e Pagamento */}
      <div className="flex-1 flex gap-2 min-h-0">
        {/* Carrinho */}
        <Card className="flex-1 flex flex-col shadow-md min-h-0">
          <CardHeader className="pb-2 pt-3 px-4 border-b">
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Carrinho ({cart.length})
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                disabled={cart.length === 0 || isProcessing}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur-sm z-10">
                  <TableRow className="text-lg">
                    <TableHead className="w-[45%] text-lg font-bold py-4">PRODUTO</TableHead>
                    <TableHead className="text-center w-[20%] text-lg font-bold py-4">QTD</TableHead>
                    <TableHead className="text-right w-[17%] text-lg font-bold py-4">PRECO</TableHead>
                    <TableHead className="text-right w-[18%] text-lg font-bold py-4">TOTAL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-64 text-center">
                        <div className="flex flex-col items-center gap-3 text-muted-foreground">
                          <ShoppingCart className="h-20 w-20 opacity-20" />
                          <div>
                            <p className="font-bold text-2xl">CARRINHO VAZIO</p>
                            <p className="text-lg mt-2">Escaneie produtos para comecar</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    cart.map((item, index) => (
                      <TableRow key={index} className="group border-b-2" data-testid={`cart-item-${index}`}>
                        <TableCell className="font-bold py-4">
                          <div>
                            <p className="text-xl uppercase line-clamp-1 tracking-wide">{item.nome}</p>
                            {item.peso && (
                              <p className="text-base text-muted-foreground font-normal mt-1">Peso: {item.peso.toFixed(3)} kg</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-10 w-10"
                              onClick={() => updateQuantity(index, item.quantidade - (item.peso ? 0.1 : 1))}
                              disabled={isProcessing}
                              data-testid={`btn-decrease-${index}`}
                            >
                              <Minus className="h-5 w-5" />
                            </Button>
                            <span className="w-16 text-center font-black text-2xl">
                              {item.peso ? item.quantidade.toFixed(3) : item.quantidade}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-10 w-10"
                              onClick={() => updateQuantity(index, item.quantidade + (item.peso ? 0.1 : 1))}
                              disabled={(!item.peso && item.quantidade >= item.estoque_disponivel) || isProcessing}
                              data-testid={`btn-increase-${index}`}
                            >
                              <Plus className="h-5 w-5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 text-red-600 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeItem(index)}
                              disabled={isProcessing}
                              data-testid={`btn-remove-${index}`}
                            >
                              <X className="h-5 w-5" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-xl font-semibold py-4">
                          R$ {item.preco.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-black text-2xl text-primary py-4">
                          R$ {item.subtotal.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Painel de Pagamento */}
        <Card className="w-96 flex flex-col shadow-md">
          <CardHeader className="pb-2 pt-3 px-4 border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5" />
              Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-3 p-4">
            {/* Total */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border-2 border-primary/20">
              <div className="text-sm text-muted-foreground mb-1">Total da Venda</div>
              <div className="text-4xl font-bold text-primary">
                R$ {valorTotal.toFixed(2)}
              </div>
              {descontoPercentual > 0 && (
                <div className="text-xs text-red-600 mt-1">
                  Desconto: {descontoPercentual}% (- R$ {valorDesconto.toFixed(2)})
                </div>
              )}
            </div>

            {/* Forma de Pagamento */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Forma de Pagamento</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'dinheiro', label: 'Dinheiro', icon: Banknote },
                  { value: 'cartao_debito', label: 'Débito', icon: CreditCard },
                  { value: 'cartao_credito', label: 'Crédito', icon: CreditCard },
                  { value: 'pix', label: 'Pix', icon: DollarSign }
                ].map(({ value, label, icon: Icon }) => (
                  <Button
                    key={value}
                    variant={formaPagamento === value ? "default" : "outline"}
                    onClick={() => setFormaPagamento(value)}
                    className="h-10 justify-start"
                    disabled={isProcessing}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Desconto */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-1">
                <Percent className="h-4 w-4" />
                Desconto (%)
              </Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={descontoPercentual}
                onChange={(e) => setDescontoPercentual(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                className="h-10"
                disabled={isProcessing}
              />
            </div>

            {/* Valor Pago (só para dinheiro) */}
            {formaPagamento === 'dinheiro' && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Valor Pago</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={valorPago}
                  onChange={(e) => setValorPago(e.target.value)}
                  onKeyDown={handleValorPagoKeyDown}
                  placeholder="0,00"
                  className="h-10 text-lg font-semibold"
                  disabled={isProcessing}
                />
                {valorPago && parseFloat(valorPago) >= valorTotal && (
                  <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3 border border-green-200 dark:border-green-800">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Troco:</span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        R$ {troco.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Botão Finalizar */}
            <Button
              onClick={handleCompleteSale}
              disabled={cart.length === 0 || isProcessing}
              className="w-full h-12 text-base font-bold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              size="lg"
            >
              <Check className="h-5 w-5 mr-2" />
              {isProcessing ? "Processando..." : "Finalizar Venda"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Dialog da Balança */}
      <Dialog open={showBalancaDialog} onOpenChange={setShowBalancaDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Produto Pesado
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Peso (kg)</Label>
              <Input
                type="number"
                step="0.001"
                value={pesoBalanca}
                onChange={(e) => setPesoBalanca(e.target.value)}
                placeholder="0.000"
                className="text-2xl font-bold text-center"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowBalancaDialog(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleBalancaInput} className="flex-1">
                Confirmar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Venda</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-3 mt-4 text-base">
                <div className="flex justify-between font-bold text-lg border-b pb-2">
                  <span>Total:</span>
                  <span className="text-primary">R$ {valorTotal.toFixed(2)}</span>
                </div>
                
                {formaPagamento === 'dinheiro' && (
                  <>
                    <div className="flex justify-between">
                      <span>Valor Pago:</span>
                      <span className="font-semibold">R$ {parseFloat(valorPago || "0").toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Troco:</span>
                      <span className="font-bold text-xl">R$ {troco.toFixed(2)}</span>
                    </div>
                  </>
                )}

                <div className="flex justify-between">
                  <span>Pagamento:</span>
                  <span className="font-semibold capitalize">{formaPagamento.replace('_', ' ')}</span>
                </div>

                {clienteId !== "none" && (
                  <div className="flex justify-between">
                    <span>Cliente:</span>
                    <span className="font-semibold">
                      {clientes.find((c) => c.id.toString() === clienteId)?.nome || ""}
                    </span>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSale} disabled={isProcessing}>
              {isProcessing ? "Processando..." : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de Ajuda - Atalhos de Teclado */}
      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <Keyboard className="h-7 w-7" />
              ATALHOS DE TECLADO
            </DialogTitle>
            <DialogDescription className="text-base">
              Use as teclas de funcao para agilizar o atendimento
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 mt-4">
            {shortcuts.map((shortcut) => (
              <div
                key={shortcut.key}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                data-testid={`shortcut-${shortcut.key}`}
              >
                <div className="flex items-center gap-3 min-w-[140px]">
                  <span className="bg-primary text-primary-foreground px-3 py-2 rounded font-mono font-bold text-lg min-w-[60px] text-center">
                    {shortcut.key}
                  </span>
                  <shortcut.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg">{shortcut.action}</p>
                  <p className="text-sm text-muted-foreground">{shortcut.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-primary/10 rounded-lg text-center">
            <p className="text-sm font-medium">Pressione <span className="font-mono bg-primary text-primary-foreground px-2 py-1 rounded">F1</span> a qualquer momento para ver esta ajuda</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
