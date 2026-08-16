import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { buscaDespesasExtras, buscaFormasPagamento, buscaBancos, buscaComprasParceladas, buscaDespesasFixas } from './dashboard-action';
import { buscarStatusOnboarding, buscarDadosDashboardPluggy } from './pluggy-actions';
import DashboardClient from './dashboard-client';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const hasAuth = cookieStore.get('auth_token')?.value || cookieStore.get('refresh_token')?.value;
  if (!hasAuth) redirect('/login');

  const [despesas, formasPagamento, bancos, comprasParceladas, despesasFixas, onboardingStatus, dadosPluggy] = await Promise.all([
    buscaDespesasExtras(),
    buscaFormasPagamento(),
    buscaBancos(),
    buscaComprasParceladas(),
    buscaDespesasFixas(),
    buscarStatusOnboarding(),
    buscarDadosDashboardPluggy()
  ]);

  const saldoTotal = despesas.reduce(
    (sum: number, item: any) => sum + parseFloat(item.purchaseValue || 0),
    0
  );

  return (
    <DashboardClient
      initialDespesas={despesas}
      initialFormasPagamento={formasPagamento}
      initialBancos={bancos}
      initialComprasParceladas={comprasParceladas}
      initialDespesasFixas={despesasFixas}
      saldoTotal={saldoTotal}
      onboardingCompleted={onboardingStatus?.onboardingCompleted ?? false}
      initialDadosPluggy={dadosPluggy}
    />
  );
}