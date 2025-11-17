import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { TrialExpiredModal } from "@/components/TrialExpiredModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useLocation, Link } from "wouter";
import { RotateCcw, Truck, FileText } from "lucide-react"; // Added FileText import
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"; // Added SidebarMenuItem and SidebarMenuButton imports
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { logger } from "@/lib/securityUtils";
import {
  Home,
  Package,
  ShoppingCart,
  BarChart3,
  Users,
  DollarSign,
  Settings,
  Menu,
  X,
  LogOut,
  CreditCard,
  TrendingUp,
  Calendar,
  Wallet,
  FileBarChart,
  Crown,
  UserPlus,
  UserCog,
  BookOpen,
  Undo2,
  Receipt,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, ReactNode } from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EmployeePurchaseDialog } from "@/components/EmployeePurchaseDialog";
import { fetchPlanPricesFromServer } from "@/lib/planPrices";


interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location, setLocation] = useLocation();
  const [userEmail, setUserEmail] = React.useState("usuario@email.com");

  React.useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserEmail(user.email || "usuario@email.com");
      } catch (e) {
        setUserEmail("usuario@email.com");
      }
    }
  }, []);

  const handleLogout = () => {
    console.log("Logout realizado");
    localStorage.removeItem("user");
    setLocation("/");
  };

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  const isPDVPage = location === "/pdv";

  // Buscar preços dinâmicos do backend no Dashboard e CheckoutForm
  const [precos, setPrecos] = useState({
    premium_mensal: 79.99,
    premium_anual: 767.04,
  });

  useEffect(() => {
    const carregarPrecos = async () => {
      try {
        const precosAtualizados = await fetchPlanPricesFromServer();
        setPrecos(precosAtualizados);
      } catch (error) {
        console.error('❌ Erro ao carregar preços:', error);
      }
    };
    carregarPrecos();
  }, []);

  const valorMensal = precos.premium_mensal;
  const valorAnual = precos.premium_anual;
  const valorAnualMensal = valorAnual / 12;
  const economia = (valorMensal * 12) - valorAnual;

  // Dados mockados dos planos para o Card de Upgrade (Dashboard)
  const planosMock = [
    {
      nome: "Plano Mensal",
      preco: `R$ ${valorMensal.toFixed(2).replace('.', ',')}`,
      periodo: "/mês",
      tipo: "premium_mensal",
    },
    {
      nome: "Plano Anual",
      preco: `R$ ${valorAnualMensal.toFixed(2).replace('.', ',')}`,
      periodo: "/mês",
      valorTotal: `R$ ${valorAnual.toFixed(2).replace('.', ',')}/ano`,
      economia: `Economize R$ ${economia.toFixed(2).replace('.', ',')}`,
      tipo: "premium_anual",
      destaque: true,
    },
  ];

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <TrialExpiredModal />
      <div className="flex h-screen w-full">
        <DashboardSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          {!isPDVPage && <DashboardHeader userEmail={userEmail} onLogout={handleLogout} />}
          <main className="flex-1 overflow-auto p-6 bg-background">
            {children}

            {/* Botão do WhatsApp - não aparece em Caixa e PDV */}
            <WhatsAppButton
              phoneNumber={localStorage.getItem('whatsapp_number') || "+5598984267488"}
              message="Olá! Gostaria de tirar uma dúvida sobre o Pavisoft Sistemas."
            />

            <footer className="mt-8 pt-6 border-t border-border">
              <p className="text-center text-xs text-muted-foreground">
                Desenvolvido por <span className="font-medium text-foreground">Pavisoft Sistemas</span>
              </p>
            </footer>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}