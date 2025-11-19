
import { useState, useEffect } from "react";
import { Check, Shield, Lock, CheckCircle, Mail, Package, CreditCard, ArrowLeft, Sparkles, Zap, TrendingUp, Users, BarChart3, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckoutForm } from "@/components/CheckoutForm";
import { Link, useLocation } from "wouter";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { getPlanPrices, fetchPlanPricesFromServer, formatPrice, calculateAnnualSavings } from "@/lib/planPrices";

export default function Planos() {
  const { user } = useUser();
  const [, setLocation] = useLocation();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    plano: "premium_mensal" | "premium_anual";
    planoNome: string;
    planoPreco: string;
  } | null>(null);
  const { toast } = useToast();
  const [precos, setPrecos] = useState(getPlanPrices());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarPrecos = async () => {
      setLoading(true);
      try {
        const precosAtualizados = await fetchPlanPricesFromServer();
        setPrecos(precosAtualizados);
      } catch (error) {
        console.error('❌ [PLANOS] Erro ao carregar preços:', error);
        setPrecos(getPlanPrices());
      } finally {
        setLoading(false);
      }
    };
    
    carregarPrecos();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');

    if (status) {
      if (status === 'success' || status === 'approved') {
        toast({
          title: "🎉 Pagamento Confirmado!",
          description: "Sua assinatura será ativada em breve. Você receberá um e-mail de confirmação.",
        });
      } else if (status === 'failure') {
        toast({
          title: "❌ Pagamento Recusado",
          description: "Não foi possível processar seu pagamento. Tente novamente.",
          variant: "destructive",
        });
      } else if (status === 'pending') {
        toast({
          title: "⏳ Pagamento Pendente",
          description: "Seu pagamento está sendo processado. Aguarde a confirmação.",
        });
      }

      localStorage.removeItem('pending_subscription');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast]);

  const handleBackToSystem = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setLocation("/dashboard");
    } else {
      setLocation("/login");
    }
  };

  const valorMensal = precos.premium_mensal;
  const valorAnual = precos.premium_anual;
  const valorAnualMensal = valorAnual / 12;
  const economia = calculateAnnualSavings(valorMensal, valorAnual);

  const handleSelectPlan = (tipo: string) => {
    if (tipo === "mensal") {
      setSelectedPlan({
        plano: "premium_mensal",
        planoNome: "Plano Mensal",
        planoPreco: formatPrice(precos.premium_mensal)
      });
    } else {
      setSelectedPlan({
        plano: "premium_anual",
        planoNome: "Plano Anual",
        planoPreco: formatPrice(precos.premium_anual / 12)
      });
    }
    setCheckoutOpen(true);
  };

  const recursos = [
    { icon: BarChart3, titulo: "PDV Completo", desc: "Sistema de ponto de venda moderno e intuitivo" },
    { icon: Package, titulo: "Gestão de Estoque", desc: "Controle total de produtos e inventário" },
    { icon: FileText, titulo: "NFC-e", desc: "Emissão de notas fiscais eletrônicas" },
    { icon: TrendingUp, titulo: "Relatórios Avançados", desc: "Dashboards e análises em tempo real" },
    { icon: Users, titulo: "Multi-usuário", desc: "Gerencie funcionários e permissões" },
    { icon: Shield, titulo: "Backup Automático", desc: "Seus dados sempre seguros" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950" data-testid="page-planos">
      {/* Header */}
      <nav className="bg-black/30 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer group">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Pavisoft Sistemas
                </span>
              </div>
            </Link>
            <Button
              variant="outline"
              className="gap-2 border-white/20 hover:bg-white/10 text-white"
              onClick={handleBackToSystem}
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Sistema
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-purple-300 font-medium">Transforme seu negócio hoje</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6" data-testid="text-title">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Escolha o Plano Ideal
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto" data-testid="text-subtitle">
            Sistema completo de gestão para sua empresa crescer com segurança e eficiência
          </p>
        </div>

        {/* Recursos em Destaque */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {recursos.map((recurso, index) => (
            <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-4 text-center">
                <recurso.icon className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                <h3 className="text-sm font-semibold text-white mb-1">{recurso.titulo}</h3>
                <p className="text-xs text-gray-400">{recurso.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Planos */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Plano Mensal */}
          <Card 
            className="bg-white/5 border-white/10 backdrop-blur-xl hover:border-blue-500/50 transition-all group"
            data-testid="card-plano-mensal"
          >
            <CardHeader className="text-center pb-8 pt-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 mx-auto group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-white mb-2" data-testid="text-nome-mensal">
                Plano Mensal
              </CardTitle>
              <CardDescription className="text-gray-400" data-testid="text-descricao-mensal">
                Flexibilidade total
              </CardDescription>
              <div className="mt-6">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent" data-testid="text-preco-mensal">
                    {formatPrice(valorMensal)}
                  </span>
                  <span className="text-gray-400 text-xl" data-testid="text-periodo-mensal">/mês</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {[
                  "Acesso completo ao sistema",
                  "1 funcionário incluso",
                  "PDV e controle de caixa",
                  "Gestão de estoque ilimitada",
                  "Emissão de NFC-e",
                  "Relatórios em tempo real",
                  "Gestão financeira completa",
                  "Suporte por email",
                  "Backup automático diário"
                ].map((recurso, index) => (
                  <li key={index} className="flex items-start gap-3" data-testid={`item-recurso-mensal-${index}`}>
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{recurso}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className="w-full text-lg py-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/50"
                onClick={() => handleSelectPlan('mensal')}
                data-testid="button-contratar-mensal"
              >
                Contratar Agora
              </Button>
            </CardContent>
          </Card>

          {/* Plano Anual */}
          <Card 
            className="relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/50 backdrop-blur-xl shadow-2xl shadow-purple-500/20 group overflow-hidden"
            data-testid="card-plano-anual"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-bl-full opacity-20"></div>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full shadow-lg" data-testid="badge-destaque">
                <span className="font-bold">🔥 Mais Popular - Economize {formatPrice(economia)}</span>
              </div>
            </div>

            <CardHeader className="text-center pb-8 pt-14 relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 mx-auto group-hover:scale-110 transition-transform">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-white mb-2" data-testid="text-nome-anual">
                Plano Anual
              </CardTitle>
              <CardDescription className="text-gray-300" data-testid="text-descricao-anual">
                Melhor custo-benefício
              </CardDescription>
              <div className="mt-6">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent" data-testid="text-preco-anual">
                    {formatPrice(valorAnualMensal)}
                  </span>
                  <span className="text-gray-300 text-xl" data-testid="text-periodo-anual">/mês</span>
                </div>
                <p className="text-sm text-purple-300 mt-2">
                  {formatPrice(valorAnual)}/ano • 12x sem juros
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {[
                  "Todos os recursos do plano mensal",
                  "1 funcionário incluso",
                  `Economize ${formatPrice(economia)} por ano`,
                  "Suporte prioritário",
                  "Backups em tempo real",
                  "Atualizações antecipadas",
                  "Acesso completo ao sistema",
                  "PDV e controle de caixa",
                  "Gestão financeira completa"
                ].map((recurso, index) => (
                  <li key={index} className="flex items-start gap-3" data-testid={`item-recurso-anual-${index}`}>
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-white font-medium">{recurso}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className="w-full text-lg py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/50"
                onClick={() => handleSelectPlan('anual')}
                data-testid="button-contratar-anual"
              >
                Contratar Agora
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Segurança */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-white text-center flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-green-400" />
              Segurança no Pagamento
            </CardTitle>
            <p className="text-center text-gray-400 mt-2">
              Sua compra é 100% segura e protegida
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                <Lock className="h-5 w-5 text-blue-400 mt-1" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Criptografia SSL/TLS</h3>
                  <p className="text-gray-400 text-sm">Todos os dados do pagamento são criptografados</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                <Shield className="h-5 w-5 text-green-400 mt-1" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Dados Protegidos</h3>
                  <p className="text-gray-400 text-sm">Informações nunca armazenadas em nossos servidores</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                <CreditCard className="h-5 w-5 text-purple-400 mt-1" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Gateway Seguro Mercado Pago</h3>
                  <p className="text-gray-400 text-sm">Certificado PCI-DSS Nível 1</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                <CheckCircle className="h-5 w-5 text-green-400 mt-1" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Conformidade LGPD</h3>
                  <p className="text-gray-400 text-sm">Totalmente em conformidade com a LGPD</p>
                </div>
              </div>
            </div>

            <div className="text-center p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
              <p className="text-gray-300 mb-2">
                Tem dúvidas sobre segurança ou pagamento?
              </p>
              <Button
                variant="default"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
                onClick={() => window.location.href = 'mailto:atendimento.pavisoft@gmail.com'}
                data-testid="button-email-suporte"
              >
                <Mail className="h-4 w-4" />
                Entre em Contato
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/10">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Package className="h-6 w-6 text-purple-400" />
              <span className="text-white font-bold">Pavisoft Sistemas</span>
            </div>
            <p className="text-sm text-gray-400">© 2025 Pavisoft Sistemas. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>

      {selectedPlan && (
        <CheckoutForm
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          plano={selectedPlan.plano}
          planoNome={selectedPlan.planoNome}
          planoPreco={selectedPlan.planoPreco}
        />
      )}
    </div>
  );
}
