import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getPlanPrices, formatPrice, calculateAnnualSavings, fetchPlanPricesFromServer } from "@/lib/planPrices";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Check, CreditCard, Building2, QrCode, Shield, Zap, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { validateCpfOrCnpj } from "@/lib/validators";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

const checkoutSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  cpfCnpj: z.string().refine(validateCpfOrCnpj, {
    message: "CPF/CNPJ inválido",
  }),
  formaPagamento: z.enum(["BOLETO", "CREDIT_CARD", "PIX"], {
    errorMap: () => ({ message: "Selecione uma forma de pagamento" }),
  }),
  cupom: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plano: "premium_mensal" | "premium_anual";
  planoNome: string;
  planoPreco: string;
}

const planoBeneficios = [
  "Produtos ilimitados",
  "Usuários ilimitados",
  "Emissão de NF-e/NFC-e",
  "Relatórios avançados",
  "Suporte prioritário",
  "Backup automático",
  "Dashboard em tempo real",
];

export function CheckoutForm({
  open,
  onOpenChange,
  plano,
  planoNome,
  planoPreco,
}: CheckoutFormProps) {
  // NOTA: Este formulário deve funcionar mesmo para usuários bloqueados
  // Isso permite que eles façam upgrade e reativem suas contas
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validandoCupom, setValidandoCupom] = useState(false);
  const [cupomValidado, setCupomValidado] = useState<any>(null);
  // Buscar preços dinâmicos do backend
  const [precos, setPrecos] = useState({
    premium_mensal: 89.99,
    premium_anual: 951.00,
  });

  useEffect(() => {
    const carregarPrecos = async () => {
      try {
        const precosAtualizados = await fetchPlanPricesFromServer();
        console.log('💰 [CHECKOUT] Preços carregados:', precosAtualizados);
        setPrecos(precosAtualizados);
      } catch (error) {
        console.error('❌ [CHECKOUT] Erro ao carregar preços:', error);
      }
    };
    carregarPrecos();
  }, []);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      nome: "",
      email: "",
      cpfCnpj: "",
      formaPagamento: "PIX",
      cupom: "",
    },
  });

  const formaPagamento = form.watch("formaPagamento");
  const cupomCodigo = form.watch("cupom");
  const selectedPlan = plano;

  const valorBase = plano === "premium_mensal" ? precos.premium_mensal : precos.premium_anual;
  const valorMensal = plano === "premium_anual" ? (precos.premium_anual / 12) : valorBase;

  const validarCupom = async () => {
    if (!cupomCodigo || cupomCodigo.trim() === "") {
      toast({
        title: "Digite um código",
        description: "Por favor, digite um código de cupom",
        variant: "destructive",
      });
      return;
    }

    setValidandoCupom(true);
    try {
      const userStr = localStorage.getItem("user");
      const userId = userStr ? JSON.parse(userStr).id : null;

      const res = await apiRequest("POST", "/api/cupons/validar", {
        codigo: cupomCodigo.trim(),
        plano: selectedPlan,
        userId,
      });

      const resultado = await res.json();

      if (resultado.valido) {
        setCupomValidado(resultado);
        toast({
          title: "✅ Cupom aplicado!",
          description: `Desconto de ${resultado.cupom.tipo === 'percentual' ? resultado.cupom.valor + '%' : 'R$ ' + resultado.cupom.valor.toFixed(2)} aplicado`,
        });
      }
    } catch (error: any) {
      setCupomValidado(null);
      toast({
        title: "Cupom inválido",
        description: error.message || "Este cupom não pode ser aplicado",
        variant: "destructive",
      });
    } finally {
      setValidandoCupom(false);
    }
  };

  const removerCupom = () => {
    setCupomValidado(null);
    form.setValue("cupom", "");
    toast({
      title: "Cupom removido",
      description: "O desconto foi removido do pedido",
    });
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      const res = await apiRequest("POST", "/api/checkout", {
        ...data,
        plano,
        cupom: cupomValidado ? cupomValidado.cupom.codigo : null,
      });

      const result = await res.json(); // Renamed from response to result for clarity

      if (result.preference?.init_point) {
        toast({
          title: "✅ Redirecionando para pagamento",
          description: "Você será redirecionado para o Mercado Pago em instantes...",
        });

        // Salvar dados da assinatura no localStorage
        localStorage.setItem('pending_subscription', JSON.stringify({
          subscriptionId: result.subscription.id,
          plano: selectedPlan,
          timestamp: new Date().toISOString(),
        }));

        // Redirecionar para o checkout do Mercado Pago
        setTimeout(() => {
          window.location.href = result.preference.init_point;
        }, 1500);
      } else {
        // Handle cases where init_point is not available but there's a message
        toast({
          title: "Assinatura iniciada",
          description: result.message || "Verifique seu email para mais informações.",
        });
        onOpenChange(false);
        form.reset();
      }


    } catch (error: any) {
      toast({
        title: "Erro ao processar pagamento",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPaymentIcon = (tipo: string) => {
    switch (tipo) {
      case "PIX":
        return <QrCode className="h-5 w-5" />;
      case "BOLETO":
        return <Building2 className="h-5 w-5" />;
      case "CREDIT_CARD":
        return <CreditCard className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getPaymentDescription = (tipo: string) => {
    switch (tipo) {
      case "PIX":
        return "Pagamento instantâneo via QR Code";
      case "BOLETO":
        return "Vencimento em até 3 dias úteis";
      case "CREDIT_CARD":
        return "Processamento imediato";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 border-2 border-blue-200 dark:border-blue-800 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Finalizar Assinatura
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 dark:text-gray-400">
            Complete seus dados para ativar o {planoNome}
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 my-4">
          {/* Resumo do Plano */}
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 shadow-xl">
            <div className="space-y-4">
              <div>
                <Badge className="bg-white/20 text-white border-0 mb-3">
                  {plano === "premium_anual" && "👑 Mais Popular - Economize 15%"}
                  {plano === "premium_mensal" && "⚡ Flexibilidade total"}
                </Badge>
                <h3 className="text-2xl font-bold">{planoNome}</h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-bold">{planoPreco.split("/")[0]}</span>
                  <span className="text-lg opacity-90">
                    /{planoPreco.split("/")[1]}
                  </span>
                </div>
                {plano === "premium_anual" && (
                  <p className="text-sm opacity-90 mt-2">
                    💰 Valor total: R$ {precos.premium_anual.toFixed(2)}/ano • Economize R$ {(precos.premium_mensal * 12 - precos.premium_anual).toFixed(2)}
                  </p>
                )}
              </div>

              <Separator className="bg-white/20" />

              <div>
                <p className="font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Benefícios Inclusos:
                </p>
                <ul className="space-y-2">
                  {planoBeneficios.map((beneficio, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{beneficio}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-white/20">
                <p className="text-xs opacity-90 flex items-center gap-2">
                  <Zap className="h-3 w-3" />
                  Ativação imediata após confirmação do pagamento
                </p>
              </div>
            </div>
          </Card>

          {/* Formulário */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white font-semibold">
                      Nome Completo *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Seu nome completo"
                        className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500"
                        data-testid="input-checkout-nome"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white font-semibold">
                      Email *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="seu@email.com"
                        className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500"
                        data-testid="input-checkout-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cpfCnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white font-semibold">
                      CPF/CNPJ *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="000.000.000-00"
                        className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500"
                        data-testid="input-checkout-cpfcnpj"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="formaPagamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white font-semibold">
                      Forma de Pagamento *
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 h-12"
                          data-testid="select-forma-pagamento"
                        >
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-gray-800">
                        <SelectItem value="PIX" data-testid="option-pix">
                          <div className="flex items-center gap-3 py-1">
                            <QrCode className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-semibold">PIX</p>
                              <p className="text-xs text-gray-500">Aprovação instantânea</p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="BOLETO" data-testid="option-boleto">
                          <div className="flex items-center gap-3 py-1">
                            <Building2 className="h-5 w-5 text-orange-600" />
                            <div>
                              <p className="font-semibold">Boleto Bancário</p>
                              <p className="text-xs text-gray-500">Vence em 3 dias</p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="CREDIT_CARD"
                          data-testid="option-credit-card"
                        >
                          <div className="flex items-center gap-3 py-1">
                            <CreditCard className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-semibold">Cartão de Crédito</p>
                              <p className="text-xs text-gray-500">Processamento rápido</p>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo de Cupom */}
              <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
                <div className="space-y-2">
                  <Label className="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    Cupom de Desconto
                    <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                      Opcional
                    </Badge>
                  </Label>
                  <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="cupom"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Digite o código"
                            className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 uppercase"
                            disabled={!!cupomValidado}
                            data-testid="input-cupom"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {!cupomValidado ? (
                    <Button
                      type="button"
                      onClick={validarCupom}
                      disabled={validandoCupom || !cupomCodigo}
                      variant="outline"
                      data-testid="button-validar-cupom"
                    >
                      {validandoCupom ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Aplicar"
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={removerCupom}
                      variant="outline"
                      className="text-red-600"
                      data-testid="button-remover-cupom"
                    >
                      Remover
                    </Button>
                  )}
                </div>
                {cupomValidado && (
                  <Card className="p-3 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 mt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-900 dark:text-green-100">
                          {cupomValidado.cupom.descricao || cupomValidado.cupom.codigo}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-green-600">
                        -R$ {cupomValidado.valorDesconto.toFixed(2)}
                      </span>
                    </div>
                  </Card>
                )}
              </div>
            </Card>

              {formaPagamento && (
                <Card className="p-3 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    {getPaymentIcon(formaPagamento)}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                        {formaPagamento === "PIX" && "Pagamento PIX"}
                        {formaPagamento === "BOLETO" && "Boleto Bancário"}
                        {formaPagamento === "CREDIT_CARD" && "Cartão de Crédito"}
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        {getPaymentDescription(formaPagamento)}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Resumo do Valor */}
              {cupomValidado ? (
                <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-2 border-purple-200 dark:border-purple-800">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Valor original:</span>
                      <span className="line-through">
                        R$ {(cupomValidado.valorFinal + cupomValidado.valorDesconto).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                      <span>Desconto:</span>
                      <span>-R$ {cupomValidado.valorDesconto.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-purple-600 dark:text-purple-400">
                        R$ {cupomValidado.valorFinal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2 border-blue-200 dark:border-blue-800">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total a pagar:</span>
                    <span className="text-blue-600 dark:text-blue-400">
                      {formatPrice(plano === 'premium_mensal' ? precos.premium_mensal : precos.premium_anual)}
                    </span>
                  </div>
                  {plano === 'premium_anual' && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Economize {formatPrice(calculateAnnualSavings(precos.premium_mensal, precos.premium_anual))} por ano
                    </p>
                  )}
                </Card>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 border-2"
                  disabled={isSubmitting}
                  data-testid="button-cancel-checkout"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isSubmitting}
                  data-testid="button-submit-checkout"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Finalizar Assinatura
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-2">
                🔒 Pagamento 100% seguro e criptografado
              </p>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}