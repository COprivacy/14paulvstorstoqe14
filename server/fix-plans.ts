
import { storage } from './storage';

async function normalizePlans() {
  try {
    console.log('🔧 Iniciando normalização de planos...');
    
    const users = await storage.getUsers();
    let fixedCount = 0;
    
    const planMap: Record<string, string> = {
      'free': 'trial',  // Migrar plano free para trial (free não existe mais)
      'trial': 'trial',
      'mensal': 'premium_mensal',
      'anual': 'premium_anual',
      'premium': 'premium_mensal',
      'premium_mensal': 'premium_mensal',
      'premium_anual': 'premium_anual'
    };
    
    for (const user of users) {
      if (!user.plano || user.plano === '') {
        // Usuários sem plano viram trial (não existe mais free)
        await storage.updateUser(user.id, { plano: 'trial' });
        fixedCount++;
        console.log(`✅ Usuário ${user.email} atualizado: (vazio) → trial`);
      } else if (user.plano === 'free') {
        // Migrar usuários com plano 'free' para 'trial'
        await storage.updateUser(user.id, { plano: 'trial' });
        fixedCount++;
        console.log(`✅ Usuário ${user.email} atualizado: free → trial`);
      } else if (planMap[user.plano.toLowerCase()] && planMap[user.plano.toLowerCase()] !== user.plano) {
        // Normalizar planos antigos
        const newPlan = planMap[user.plano.toLowerCase()];
        await storage.updateUser(user.id, { plano: newPlan });
        fixedCount++;
        console.log(`✅ Usuário ${user.email} atualizado: ${user.plano} → ${newPlan}`);
      }
    }
    
    console.log(`\n✅ Normalização concluída! ${fixedCount} usuários corrigidos de ${users.length} no total.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao normalizar planos:', error);
    process.exit(1);
  }
}

normalizePlans();
