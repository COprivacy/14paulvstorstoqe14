
import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../storage';

describe('Sistema de Bloqueio de Estoque - Orçamentos', () => {
  let testUserId: string;
  let testProdutoId: number;

  beforeEach(async () => {
    // Setup: criar usuário e produto de teste
    testUserId = 'test-user-' + Date.now();
    const produto = await storage.createProduto({
      user_id: testUserId,
      nome: 'Produto Teste Bloqueio',
      codigo_barras: 'TEST-' + Date.now(),
      preco: 100,
      quantidade: 10,
      categoria: 'teste',
    });
    testProdutoId = produto.id;
  });

  it('deve bloquear estoque ao aprovar orçamento', async () => {
    const orcamento = await storage.createOrcamento({
      user_id: testUserId,
      numero: 'ORC-TEST-' + Date.now(),
      cliente_nome: 'Cliente Teste',
      itens: [{ produto_id: testProdutoId, nome: 'Produto Teste', preco: 100, quantidade: 5 }],
      subtotal: 500,
      valor_total: 500,
      status: 'pendente',
      data_criacao: new Date().toISOString(),
      data_atualizacao: new Date().toISOString(),
    });

    await storage.updateOrcamento(orcamento.id, { status: 'aprovado' });

    const bloqueios = await storage.getBloqueiosPorProduto(testProdutoId, testUserId);
    expect(bloqueios.length).toBe(1);
    expect(bloqueios[0].quantidade_bloqueada).toBe(5);
  });

  it('deve liberar bloqueio ao rejeitar orçamento', async () => {
    const orcamento = await storage.createOrcamento({
      user_id: testUserId,
      numero: 'ORC-TEST-' + Date.now(),
      cliente_nome: 'Cliente Teste',
      itens: [{ produto_id: testProdutoId, nome: 'Produto Teste', preco: 100, quantidade: 5 }],
      subtotal: 500,
      valor_total: 500,
      status: 'aprovado',
      data_criacao: new Date().toISOString(),
      data_atualizacao: new Date().toISOString(),
    });

    await storage.updateOrcamento(orcamento.id, { status: 'rejeitado' });

    const bloqueios = await storage.getBloqueiosPorProduto(testProdutoId, testUserId);
    expect(bloqueios.length).toBe(0);
  });

  it('deve prevenir aprovação com estoque insuficiente', async () => {
    const orcamento = await storage.createOrcamento({
      user_id: testUserId,
      numero: 'ORC-TEST-' + Date.now(),
      cliente_nome: 'Cliente Teste',
      itens: [{ produto_id: testProdutoId, nome: 'Produto Teste', preco: 100, quantidade: 15 }],
      subtotal: 1500,
      valor_total: 1500,
      status: 'pendente',
      data_criacao: new Date().toISOString(),
      data_atualizacao: new Date().toISOString(),
    });

    await expect(
      storage.updateOrcamento(orcamento.id, { status: 'aprovado' })
    ).rejects.toThrow(/Estoque insuficiente/);
  });

  it('deve recalcular bloqueios ao editar orçamento aprovado', async () => {
    const orcamento = await storage.createOrcamento({
      user_id: testUserId,
      numero: 'ORC-TEST-' + Date.now(),
      cliente_nome: 'Cliente Teste',
      itens: [{ produto_id: testProdutoId, nome: 'Produto Teste', preco: 100, quantidade: 5 }],
      subtotal: 500,
      valor_total: 500,
      status: 'aprovado',
      data_criacao: new Date().toISOString(),
      data_atualizacao: new Date().toISOString(),
    });

    await storage.updateOrcamento(orcamento.id, {
      itens: [{ produto_id: testProdutoId, nome: 'Produto Teste', preco: 100, quantidade: 7 }],
      subtotal: 700,
      valor_total: 700,
    });

    const bloqueios = await storage.getBloqueiosPorProduto(testProdutoId, testUserId);
    expect(bloqueios[0].quantidade_bloqueada).toBe(7);
  });

  it('deve remover bloqueios ao converter em venda', async () => {
    const orcamento = await storage.createOrcamento({
      user_id: testUserId,
      numero: 'ORC-TEST-' + Date.now(),
      cliente_nome: 'Cliente Teste',
      itens: [{ produto_id: testProdutoId, nome: 'Produto Teste', preco: 100, quantidade: 5 }],
      subtotal: 500,
      valor_total: 500,
      status: 'aprovado',
      data_criacao: new Date().toISOString(),
      data_atualizacao: new Date().toISOString(),
    });

    await storage.converterOrcamentoEmVenda(orcamento.id, testUserId, 'Sistema', 'dinheiro');

    const bloqueios = await storage.getBloqueiosPorProduto(testProdutoId, testUserId);
    expect(bloqueios.length).toBe(0);

    const produto = await storage.getProduto(testProdutoId);
    expect(produto?.quantidade).toBe(5); // 10 - 5
  });

  it('deve calcular estoque disponível considerando bloqueios', async () => {
    await storage.createOrcamento({
      user_id: testUserId,
      numero: 'ORC-TEST-' + Date.now(),
      cliente_nome: 'Cliente Teste',
      itens: [{ produto_id: testProdutoId, nome: 'Produto Teste', preco: 100, quantidade: 6 }],
      subtotal: 600,
      valor_total: 600,
      status: 'aprovado',
      data_criacao: new Date().toISOString(),
      data_atualizacao: new Date().toISOString(),
    });

    const disponivel = await storage.getQuantidadeDisponivelProduto(testProdutoId, testUserId);
    expect(disponivel).toBe(4); // 10 - 6
  });
});
