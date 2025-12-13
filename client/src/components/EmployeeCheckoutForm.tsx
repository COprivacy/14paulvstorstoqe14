import { useState } from "react";
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
import { formatPrice } from "@/lib/planPrices";
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
import { Loader2, Check, CreditCard, Building2, QrCode, Shield, Zap, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { validateCpfOrCnpj } from "@/lib/validators";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const checkoutSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  cpfCnpj: z.string().refine(validateCpfOrCnpj, {
    message: "CPF/CNPJ inválido",
  }),
  formaPagamento: z.enum(["BOLETO", "CREDIT_CARD", "PIX"], {
    errorMap: () => ({ message: "Selecione uma forma de pagamento" }),
  }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface EmployeeCheckoutFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pacoteId: string;
  quantidade: number;
  preco: number;
}

const pacoteBeneficios = [
  "Acesso ao PDV para todos",
  "Controle individual de caixa",
  "Permissões personalizadas",
  "Relatórios por funcionário",
  "Histórico de vendas",
  "Gestão de metas",
];

export function EmployeeCheckoutForm({
  open,
  onOpenChange,
  pacoteId,
  quantidade,
  preco,
}: EmployeeCheckoutFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      nome: "",
      email: "",
      cpfCnpj: "",
      formaPagamento: "PIX",
    },
  });

  const formaPagamento = form.watch("formaPagamento");
  const precoUnitario = preco / quantidade;

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      const res = await apiRequest("POST", "/api/purchase-employees", {
        pacoteId,
        quantidade,
        valor: preco,
        nomePacote: `+${quantidade} Funcionários`,
        ...data,
      });

      const result = await res.json();

      if (result.preference?.init_point) {
        toast({
          title: "Redirecionando para pagamento",
          description: "Você será redirecionado para o Mercado Pago...",
        });

        localStorage.setItem('pending_employee_package', JSON.stringify({
          pacoteId,
          quantidade,
          valor: preco,
          timestamp: new Date().toISOString(),
        }));

        setTimeout(() => {
          window.location.href = result.preference.init_point;
        }, 1500);
      } else {
        toast({
          title: "Compra iniciada",
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
      <DialogContent className="sm:max-w-[700px] bg-gradient-to-br from-slate-50 to-green-50 dark:from-slate-900 dark:to-green-950 border-2 border-green-200 dark:border-green-800 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Adicionar Funcionários
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 dark:text-gray-400">
            Complete seus dados para ativar +{quantidade} funcionários
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 my-4">
          <Card className="p-6 bg-gradient-to-br from-green-500 to-teal-600 text-white border-0 shadow-xl">
            <div className="space-y-4">
              <div>
                <Badge className="bg-white/20 text-white border-0 mb-3">
                  <Users className="h-3 w-3 mr-1" />
                  Pacote de Funcionários
                </Badge>
                <h3 className="text-2xl font-bold">+{quantidade} Funcionários</h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-bold">{formatPrice(preco)}</span>
                  <span className="text-lg opacity-90">/mês</span>
                </div>
                <p className="text-sm opacity-90 mt-2">
                  {formatPrice(precoUnitario)} por funcionário/mês
                </p>
              </div>

              <Separator className="bg-white/20" />

              <div>
                <p className="font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Benefícios Inclusos:
                </p>
                <ul className="space-y-2">
                  {pacoteBeneficios.map((beneficio, index) => (
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
                        className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-green-500"
                        data-testid="input-employee-checkout-nome"
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
                        className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-green-500"
                        data-testid="input-employee-checkout-email"
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
                        className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-green-500"
                        data-testid="input-employee-checkout-cpfcnpj"
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger
                          className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 h-12"
                          data-testid="select-employee-forma-pagamento"
                        >
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-gray-800">
                        <SelectItem value="PIX">
                          <div className="flex items-center gap-3 py-1">
                            <QrCode className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-semibold">PIX</p>
                              <p className="text-xs text-gray-500">Aprovação instantânea</p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="BOLETO">
                          <div className="flex items-center gap-3 py-1">
                            <Building2 className="h-5 w-5 text-orange-600" />
                            <div>
                              <p className="font-semibold">Boleto Bancário</p>
                              <p className="text-xs text-gray-500">Vence em 3 dias</p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="CREDIT_CARD">
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

              {formaPagamento && (
                <Card className="p-3 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    {getPaymentIcon(formaPagamento)}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                        {formaPagamento === "PIX" && "Pagamento PIX"}
                        {formaPagamento === "BOLETO" && "Boleto Bancário"}
                        {formaPagamento === "CREDIT_CARD" && "Cartão de Crédito"}
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                        {getPaymentDescription(formaPagamento)}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              <Card className="p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 border-2 border-green-200 dark:border-green-800">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total mensal:</span>
                  <span className="text-green-600 dark:text-green-400">
                    {formatPrice(preco)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  +{quantidade} funcionários adicionais ao seu plano
                </p>
              </Card>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 border-2"
                  disabled={isSubmitting}
                  data-testid="button-cancel-employee-checkout"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold shadow-lg"
                  disabled={isSubmitting}
                  data-testid="button-submit-employee-checkout"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Contratar Pacote"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
