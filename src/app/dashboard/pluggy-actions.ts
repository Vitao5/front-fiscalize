'use server';

import { apiClient } from '@/lib/api-client';

export async function buscarStatusOnboarding() {
  try {
    const response = await apiClient.get('/pluggy/onboarding-status');
    return response.ok ? response.data : { onboardingCompleted: false, itemCount: 0 };
  } catch {
    return { onboardingCompleted: false, itemCount: 0 };
  }
}

export async function buscarConectores() {
  try {
    const response = await apiClient.get('/pluggy/connectors');
    return response.ok ? (response.data?.connectors ?? []) : [];
  } catch {
    return [];
  }
}

export async function buscarConnectToken() {
  try {
    const response = await apiClient.post('/pluggy/connect-token', {});
    if (!response.ok) throw new Error(response.message || 'Erro ao gerar token');
    return response.data.accessToken;
  } catch (err) {
    console.error('Erro ao buscar connect token:', err);
    throw err;
  }
}

export async function salvarPluggyItem(pluggyItemId: string, connectorName?: string, connectorId?: number) {
  try {
    const response = await apiClient.post('/pluggy/items', {
      pluggyItemId,
      connectorName: connectorName || 'Instituição',
      connectorId: connectorId || 0
    });
    if (!response.ok) throw new Error(response.message || 'Erro ao salvar conexão');
    return response.data;
  } catch (err) {
    console.error('Erro ao salvar item Pluggy:', err);
    throw err;
  }
}

export async function buscarInstituicoesConectadas() {
  try {
    const response = await apiClient.get('/pluggy/items');
    return response.ok ? (response.data?.items ?? []) : [];
  } catch {
    return [];
  }
}

export async function deletarInstituicao(id: string) {
  try {
    const response = await apiClient.delete(`/pluggy/items/${id}`);
    if (!response.ok) throw new Error(response.message || 'Erro ao remover conexão');
    return response.data;
  } catch (err) {
    console.error('Erro ao deletar item Pluggy:', err);
    throw err;
  }
}

export async function completarOnboarding() {
  try {
    const response = await apiClient.post('/pluggy/complete-onboarding', {});
    if (!response.ok) throw new Error(response.message || 'Erro ao completar onboarding');
    return response.data;
  } catch (err) {
    console.error('Erro ao completar onboarding:', err);
    throw err;
  }
}

export async function buscarContas(itemId: string) {
  try {
    const response = await apiClient.get(`/pluggy/accounts/${itemId}`);
    return response.ok ? response.data : null;
  } catch {
    return null;
  }
}

export async function importarTransacoes(accountId: string, pluggyItemId: string) {
  try {
    const response = await apiClient.post('/pluggy/import-transactions', { accountId, pluggyItemId });
    if (!response.ok) throw new Error(response.message || 'Erro ao importar transações');
    return response.data;
  } catch (err) {
    console.error('Erro ao importar transações:', err);
    throw err;
  }
}

export async function buscarDadosDashboardPluggy() {
  try {
    const response = await apiClient.get('/pluggy/dashboard-data');
    return response.ok ? response.data : {
      saldoTotalContas: 0,
      totalFaturasCartao: 0,
      totalGastosMesPluggy: 0,
      contas: [],
      transacoes: [],
      itensConectados: []
    };
  } catch {
    return {
      saldoTotalContas: 0,
      totalFaturasCartao: 0,
      totalGastosMesPluggy: 0,
      contas: [],
      transacoes: [],
      itensConectados: []
    };
  }
}

export async function sincronizarDadosPluggy() {
  try {
    const response = await apiClient.post('/pluggy/sync', {});
    if (!response.ok) throw new Error(response.message || 'Erro ao sincronizar dados');
    return response.data;
  } catch (err) {
    console.error('Erro ao sincronizar dados Pluggy:', err);
    throw err;
  }
}

