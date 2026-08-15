'use server';

import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/lib/api-client';
import { revalidatePath } from 'next/cache';


function getErrorMessage(response: ApiResponse): string {
  if (response.status === 429) {
    return 'Muitas requisições enviadas. Aguarde alguns instantes e tente novamente.';
  }
  return response.message ?? response.error ?? `Erro na requisição (status ${response.status})`;
}

export async function buscaDespesasExtras() {
  try {
    const response = await apiClient.post('/extra-purchase/list', {});
    return response.ok ? (response.data?.listFormatted ?? []) : [];
  } catch {
    return [];
  }
}

export async function cadastraDespesaExtra(despesa: any) {
  const response = await apiClient.post('/extra-purchase/register', [despesa]);
  if (!response.ok) throw new Error(getErrorMessage(response));
  revalidatePath('/dashboard');
  return response.data;
}

export async function alteraDespesaExtra(despesa: any) {
  const response = await apiClient.post('/extra-purchase/update', despesa);
  if (!response.ok) throw new Error(getErrorMessage(response));
  revalidatePath('/dashboard');
  return response.data;
}

export async function deletaDespesaExtra(id: string) {
  const response = await apiClient.post('/extra-purchase/delete', { id });
  if (!response.ok) throw new Error(getErrorMessage(response));
  revalidatePath('/dashboard');
  return response.data;
}




export async function buscaFormasPagamento() {
  try {
    const response = await apiClient.get('/type-payments/list');
    return response.ok ? (response.data?.listaTipoPagamentos ?? []) : [];
  } catch {
    return [];
  }
}

export async function buscaBancos() {
  try {
    const response = await apiClient.get('/banks/list');
    return response.ok ? (response.data?.listaBancos ?? []) : [];
  } catch {
    return [];
  }
}




export async function cadastrarCompraParcelada(compra: any) {
  const response = await apiClient.post('/installment-purchase/register', compra);
  if (!response.ok) throw new Error(getErrorMessage(response));
  revalidatePath('/dashboard');
  return response.data;
}

export async function buscaComprasParceladas() {
  try {
    const response = await apiClient.post('/installment-purchase/list', {});
    return response.ok ? (response.data?.listFormatted ?? response.data ?? []) : [];
  } catch (err) {
    console.error("ERRO BUSCA PARCELADAS:", err);
    return [];
  }
}

export async function alteraCompraParcelada(compra: any) {
  const response = await apiClient.post('/installment-purchase/update', compra);
  if (!response.ok) throw new Error(getErrorMessage(response));
  revalidatePath('/dashboard');
  return response.data;
}

export async function deletaCompraParcelada(id: string) {
  const response = await apiClient.post('/installment-purchase/delete', { id });
  if (!response.ok) throw new Error(getErrorMessage(response));
  revalidatePath('/dashboard');
  return response.data;
}

export async function deletaParcelaIndividual(id: number | string) {
  const response = await apiClient.post('/installment-purchase/delete-installment', { id });
  if (!response.ok) throw new Error(getErrorMessage(response));
  revalidatePath('/dashboard');
  return response.data;
}

export async function buscaDespesasFixas() {
  try {
    const response = await apiClient.post('/fixed-purchase/list', {});
    return response.ok ? (response.data?.listFormatted ?? []) : [];
  } catch {
    return [];
  }
}

export async function cadastraDespesaFixa(despesa: any) {
  const response = await apiClient.post('/fixed-purchase/register', despesa);
  if (!response.ok) throw new Error(getErrorMessage(response));
  revalidatePath('/dashboard');
  return response.data;
}

export async function alteraDespesaFixa(despesa: any) {
  const response = await apiClient.post('/fixed-purchase/update', despesa);
  if (!response.ok) throw new Error(getErrorMessage(response));
  revalidatePath('/dashboard');
  return response.data;
}

export async function deletaDespesaFixa(id: string) {
  const response = await apiClient.post('/fixed-purchase/delete', { id });
  if (!response.ok) throw new Error(getErrorMessage(response));
  revalidatePath('/dashboard');
  return response.data;
}