'use server';

import { cookies } from 'next/headers';

const API_BASE = 'http://127.0.0.1:3001/api';

async function getToken() {
  return (await cookies()).get('auth_token')?.value ?? '';
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, ...options.headers },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
  return res.json();
}

export async function buscaDespesasExtras() {
  try {
    const data = await apiFetch('/extra-purchase/list', { method: 'POST', body: JSON.stringify({}) });
    return data.listFormatted ?? [];
  } catch {
    return [];
  }
}

export async function buscaFormasPagamento() {
  try {
    const data = await apiFetch('/type-payments/list', { method: 'GET' });
    return data.listaTipoPagamentos ?? [];
  } catch {
    return [];
  }
}

export async function buscaBancos() {
  try {
    const data = await apiFetch('/banks/list', { method: 'GET' });
    return data.listaBancos ?? [];
  } catch {
    return [];
  }
}

export async function cadastraDespesaExtra(despesa: any) {
  return apiFetch('/extra-purchase/register', { method: 'POST', body: JSON.stringify([despesa]) });
}

export async function alteraDespesaExtra(despesa: any) {
  return apiFetch('/extra-purchase/update', { method: 'POST', body: JSON.stringify(despesa) });
}

export async function deletaDespesa(id: string) {
  return apiFetch('/extra-purchase/delete', { method: 'POST', body: JSON.stringify({ id }) });
}