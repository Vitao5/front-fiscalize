import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { buscaDespesasExtras, buscaFormasPagamento, buscaBancos, buscaComprasParceladas } from './dashboard-action';
import DashboardClient from './dashboard-client';

export default async function DashboardPage() {
  const token = (await cookies()).get('auth_token')?.value;
  if (!token) redirect('/login');

  const [despesas, formasPagamento, bancos, comprasParceladas] = await Promise.all([
    buscaDespesasExtras(),
    buscaFormasPagamento(),
    buscaBancos(),
    buscaComprasParceladas()
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
      saldoTotal={saldoTotal}
    />
  );
}