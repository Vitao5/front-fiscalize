import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { buscaDespesasExtras, buscaFormasPagamento, buscaBancos } from './dashboard-action';
import DashboardClient from './dashboard-client';

export default async function DashboardPage() {
  const token = (await cookies()).get('auth_token')?.value;
  if (!token) redirect('/login');

  const [despesas, formasPagamento, bancos] = await Promise.all([
    buscaDespesasExtras(),
    buscaFormasPagamento(),
    buscaBancos(),
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
      saldoTotal={saldoTotal}
    />
  );
}