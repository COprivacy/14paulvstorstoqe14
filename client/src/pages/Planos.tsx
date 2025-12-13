
import { useState, useEffect } from "react";
import { Check, Shield, Lock, CheckCircle, Mail, Package, CreditCard, ArrowLeft, Sparkles, Zap, TrendingUp, Users, BarChart3, FileText, Crown, Star, UserPlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckoutForm } from "@/components/CheckoutForm";
import { Link, useLocation } from "wouter";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { getPlanPrices, fetchPlanPricesFromServer, formatPrice, calculateAnnualSavings } from "@/lib/planPrices";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EmployeePackagePrices {
  pacote_5: number;
  pacote_10: number;
  pacote_20: number;
  pacote_50: number;
}

const DEFAULT_EMPLOYEE_PRICES: EmployeePackagePrices = {
  pacote_5: 39.90,
  pacote_10: 69.90,
  pacote_20: 119.90,
  pacote_50: 249.90,
};

export default function Planos() {
  const { user } = useUser();
  const [, setLocation] = useLocation();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    plano: "premium_mensal" | "premium_anual" | "pacote_5" | "pacote_10" | "pacote_20" | "pacote_50";
    planoNome: string;
    planoPreco: string;
  } | null>(null);
  const { toast } = useToast();
  const [precos, setPrecos] = useState(getPlanPrices());
  const [employeePrices, setEmployeePrices] = useState<EmployeePackagePrices>(DEFAULT_EMPLOYEE_PRICES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarPrecos = async () => {
      setLoading(true);
      try {
        const precosAtualizados = await fetchPlanPricesFromServer();
        setPrecos(precosAtualizados);
        
        // Carregar preços dos pacotes de funcionários
        const empRes = await fetch('/api/employee-package-prices');
        if (empRes.ok) {
          const empData = await empRes.json();
          setEmployeePrices(empData);
        }
      } catch (error) {
        console.error('Erro ao carregar preços:', error);
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
          title: "Pagamento Confirmado!",
          description: "Sua assinatura será ativada em breve. Você receberá um e-mail de confirmação.",
        });
      } else if (status === 'failure') {
        toast({
          title: "Pagamento Recusado",
          description: "Não foi possível processar seu pagamento. Tente novamente.",
          variant: "destructive",
        });
      } else if (status === 'pending') {
        toast({
          title: "Pagamento Pendente",
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
    } else if (tipo === "anual") {
      setSelectedPlan({
        plano: "premium_anual",
        planoNome: "Plano Anual",
        planoPreco: formatPrice(precos.premium_anual / 12)
      });
    } else if (tipo.startsWith("pacote_")) {
      const pacoteKey = tipo as keyof EmployeePackagePrices;
      const quantidade = parseInt(tipo.split("_")[1]);
      setSelectedPlan({
        plano: tipo as any,
        planoNome: `+${quantidade} Funcionários`,
        planoPreco: formatPrice(employeePrices[pacoteKey])
      });
    }
    setCheckoutOpen(true);
  };

  const recursosPrincipais = [
    "PDV Completo",
    "Gestão de Estoque",
    "Emissão NFC-e",
    "Relatórios",
    "1 Funcionário",
    "Backup Automático"
  ];

  const employeePackages = [
    { 
      id: "pacote_5", 
      quantidade: 5, 
      preco: employeePrices.pacote_5,
      precoUnitario: employeePrices.pacote_5 / 5,
      popular: false
    },
    { 
      id: "pacote_10", 
      quantidade: 10, 
      preco: employeePrices.pacote_10,
      precoUnitario: employeePrices.pacote_10 / 10,
      popular: true
    },
    { 
      id: "pacote_20", 
      quantidade: 20, 
      preco: employeePrices.pacote_20,
      precoUnitario: employeePrices.pacote_20 / 20,
      popular: false
    },
    { 
      id: "pacote_50", 
      quantidade: 50, 
      preco: employeePrices.pacote_50,
      precoUnitario: employeePrices.pacote_50 / 50,
      popular: false
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950" data-testid="page-planos">
      {/* Header Compacto */}
      <nav className="bg-black/30 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Pavisoft
                </span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-white/80 hover:text-white hover:bg-white/10"
              onClick={handleBackToSystem}
              data-testid="button-voltar"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Compacto */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-full mb-4">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span className="text-xs text-purple-300 font-medium">Planos Premium</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-3" data-testid="text-title">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Escolha seu Plano
            </span>
          </h1>
          
          <p className="text-gray-400 max-w-xl mx-auto text-sm" data-testid="text-subtitle">
            Sistema completo de gestão empresarial com tudo que você precisa
          </p>
        </div>

        {/* Tabs para Planos */}
        <Tabs defaultValue="sistema" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-white/5 border border-white/10">
            <TabsTrigger 
              value="sistema" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              data-testid="tab-sistema"
            >
              <Crown className="h-4 w-4 mr-2" />
              Planos do Sistema
            </TabsTrigger>
            <TabsTrigger 
              value="funcionarios"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-teal-600 data-[state=active]:text-white"
              data-testid="tab-funcionarios"
            >
              <Users className="h-4 w-4 mr-2" />
              Funcionários Extra
            </TabsTrigger>
          </TabsList>

          {/* Tab Planos do Sistema */}
          <TabsContent value="sistema" className="mt-0">
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Plano Mensal */}
              <Card 
                className="bg-white/5 border-white/10 backdrop-blur-xl hover:border-blue-500/50 transition-all"
                data-testid="card-plano-mensal"
              >
                <CardHeader className="text-center pb-4 pt-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-3 mx-auto">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white" data-testid="text-nome-mensal">
                    Mensal
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-sm">
                    Flexibilidade total
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent" data-testid="text-preco-mensal">
                      {formatPrice(valorMensal)}
                    </span>
                    <span className="text-gray-400">/mês</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pb-6">
                  <div className="grid grid-cols-2 gap-2">
                    {recursosPrincipais.map((recurso, index) => (
                      <div key={index} className="flex items-center gap-1.5 text-sm" data-testid={`item-recurso-mensal-${index}`}>
                        <Check className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{recurso}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    onClick={() => handleSelectPlan('mensal')}
                    data-testid="button-contratar-mensal"
                  >
                    Contratar Mensal
                  </Button>
                </CardContent>
              </Card>

              {/* Plano Anual - Destaque */}
              <Card 
                className="relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/50 backdrop-blur-xl shadow-xl shadow-purple-500/20"
                data-testid="card-plano-anual"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 text-xs" data-testid="badge-destaque">
                    <Star className="h-3 w-3 mr-1" />
                    Economia de {formatPrice(economia)}
                  </Badge>
                </div>

                <CardHeader className="text-center pb-4 pt-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl mb-3 mx-auto">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white" data-testid="text-nome-anual">
                    Anual
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-sm">
                    Melhor custo-benefício
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent" data-testid="text-preco-anual">
                      {formatPrice(valorAnualMensal)}
                    </span>
                    <span className="text-gray-300">/mês</span>
                  </div>
                  <p className="text-xs text-purple-300 mt-1">
                    {formatPrice(valorAnual)}/ano
                  </p>
                </CardHeader>

                <CardContent className="space-y-4 pb-6">
                  <div className="grid grid-cols-2 gap-2">
                    {recursosPrincipais.map((recurso, index) => (
                      <div key={index} className="flex items-center gap-1.5 text-sm" data-testid={`item-recurso-anual-${index}`}>
                        <Check className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                        <span className="text-white font-medium">{recurso}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 text-xs">
                      Suporte Prioritário
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 text-xs">
                      Backup em Tempo Real
                    </Badge>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    onClick={() => handleSelectPlan('anual')}
                    data-testid="button-contratar-anual"
                  >
                    Contratar Anual
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab Funcionários Extra */}
          <TabsContent value="funcionarios" className="mt-0">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">
                  Expanda sua Equipe
                </h2>
                <p className="text-gray-400 text-sm">
                  Adicione mais funcionários ao seu plano Premium com pacotes especiais
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {employeePackages.map((pkg) => (
                  <Card 
                    key={pkg.id}
                    className={`relative bg-white/5 border-white/10 backdrop-blur-xl hover:border-green-500/50 transition-all ${
                      pkg.popular ? 'border-2 border-green-500/50 shadow-lg shadow-green-500/20' : ''
                    }`}
                    data-testid={`card-${pkg.id}`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10">
                        <Badge className="bg-gradient-to-r from-green-600 to-teal-600 text-white text-xs px-2 py-0.5">
                          Popular
                        </Badge>
                      </div>
                    )}

                    <CardContent className="p-4 text-center">
                      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${
                        pkg.popular 
                          ? 'bg-gradient-to-br from-green-500 to-teal-600' 
                          : 'bg-gradient-to-br from-blue-500/50 to-purple-600/50'
                      }`}>
                        <UserPlus className="h-5 w-5 text-white" />
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-1">
                        +{pkg.quantidade}
                      </h3>
                      <p className="text-xs text-gray-400 mb-3">Funcionários</p>
                      
                      <div className="mb-3">
                        <span className={`text-2xl font-bold ${
                          pkg.popular 
                            ? 'bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent' 
                            : 'text-white'
                        }`}>
                          {formatPrice(pkg.preco)}
                        </span>
                        <span className="text-gray-400 text-xs">/mês</span>
                      </div>
                      
                      <p className="text-xs text-gray-500 mb-3">
                        {formatPrice(pkg.precoUnitario)}/funcionário
                      </p>

                      <Button 
                        size="sm"
                        className={`w-full ${
                          pkg.popular 
                            ? 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700' 
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                        onClick={() => handleSelectPlan(pkg.id)}
                        data-testid={`button-contratar-${pkg.id}`}
                      >
                        Adicionar
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Users className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm">Precisa de mais funcionários?</h4>
                        <p className="text-gray-400 text-xs">Combine pacotes ou entre em contato para volumes maiores</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={() => window.location.href = 'mailto:atendimento.pavisoft@gmail.com'}
                      data-testid="button-contato-funcionarios"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Falar Conosco
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Segurança - Compacto */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl max-w-4xl mx-auto mt-10">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-5 w-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Pagamento 100% Seguro</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300 text-sm">SSL/TLS</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-gray-300 text-sm">Dados Protegidos</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-purple-400" />
                <span className="text-gray-300 text-sm">Mercado Pago</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-gray-300 text-sm">LGPD</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Compacto */}
        <footer className="mt-10 pt-6 border-t border-white/10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Package className="h-4 w-4 text-purple-400" />
              <span className="text-white font-medium text-sm">Pavisoft Sistemas</span>
            </div>
            <p className="text-xs text-gray-500">2025 Pavisoft Sistemas. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>

      {selectedPlan && (
        <CheckoutForm
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          plano={selectedPlan.plano as any}
          planoNome={selectedPlan.planoNome}
          planoPreco={selectedPlan.planoPreco}
        />
      )}
    </div>
  );
}
