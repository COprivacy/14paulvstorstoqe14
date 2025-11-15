
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface HealthCheck {
  name: string;
  status: 'healthy' | 'degraded' | 'critical';
  message: string;
  timestamp: string;
}

export function useSystemHealth() {
  const [issues, setIssues] = useState<string[]>([]);

  // Verificar produtos
  const { data: products = [] } = useQuery({
    queryKey: ["/api/produtos"],
  });

  // Verificar vendas
  const { data: vendas = [] } = useQuery({
    queryKey: ["/api/vendas"],
  });

  // Verificar devoluções
  const { data: devolucoes = [] } = useQuery({
    queryKey: ["/api/devolucoes"],
  });

  useEffect(() => {
    const newIssues: string[] = [];

    // Verificar produtos sem user_id
    const produtosSemUser = products.filter((p: any) => !p.user_id);
    if (produtosSemUser.length > 0) {
      newIssues.push(`${produtosSemUser.length} produto(s) sem user_id`);
    }

    // Verificar produtos com quantidade negativa
    const produtosNegativos = products.filter((p: any) => p.quantidade < 0);
    if (produtosNegativos.length > 0) {
      newIssues.push(`${produtosNegativos.length} produto(s) com estoque negativo`);
    }

    // Verificar vendas sem data
    const vendasSemData = vendas.filter((v: any) => !v.data);
    if (vendasSemData.length > 0) {
      newIssues.push(`${vendasSemData.length} venda(s) sem data`);
    }

    // Verificar devoluções sem status
    const devoluçõesSemStatus = devolucoes.filter((d: any) => !d.status);
    if (devoluçõesSemStatus.length > 0) {
      newIssues.push(`${devoluçõesSemStatus.length} devolução(ões) sem status`);
    }

    setIssues(newIssues);

    // Log no console se houver problemas
    if (newIssues.length > 0) {
      console.warn('⚠️ Problemas detectados no sistema:', newIssues);
    }
  }, [products, vendas, devolucoes]);

  return {
    isHealthy: issues.length === 0,
    issues,
    checksPerformed: {
      products: products.length,
      vendas: vendas.length,
      devolucoes: devolucoes.length,
    },
  };
}
