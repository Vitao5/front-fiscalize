"use client";

import { DashboardCard } from "@/components/DashboardCard";
import { Button, Modal, ModalBody, Label, TextInput, Select, Spinner } from "flowbite-react";
import { CirclePlus, DollarSign, Landmark, ShoppingCart, SquarePen, Trash2, Calendar, FileText, CheckCircle2, X, ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cadastraDespesaExtra, alteraDespesaExtra, deletaDespesa } from "./dashboard-action";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const chartOptions = {
  series: [44, 55, 13, 43],
  options: {
    chart: { type: 'pie' as const, background: 'transparent' },
    colors: ["#22c55e", "#22c0c5", "#4a97de", "#a78bfa"],
    labels: ['Fixas', 'Variáveis', 'Lazer', 'Outros'],
    legend: { position: 'bottom' as const, labels: { colors: '#94a3b8' } },
    dataLabels: { enabled: false },
  },
};

const emptyForm = {
  purchaseName: "",
  purchaseValue: "",
  bankName: "",
  purchaseTypePayment: "",
  purchaseDate: new Date().toISOString().split('T')[0],
};

interface Props {
  initialDespesas: any[];
  initialFormasPagamento: any[];
  initialBancos: any[];
  saldoTotal: number;
}

const despesasFixasMock = [
  {
    id: 1,
    nome: "Financiamento Carro",
    totalDevido: 25000.55,
    parcelas: [
      { numero: 1, valor: 1048.00, mes: "Janeiro" },
      { numero: 2, valor: 1048.00, mes: "Fevereiro" },
      { numero: 3, valor: 1048.00, mes: "Março" },
      { numero: 4, valor: 1048.00, mes: "Abril" },
      { numero: 5, valor: 1048.00, mes: "Maio" },
    ],
  },
  {
    id: 2,
    nome: "Apartamento",
    totalDevido: 180000.00,
    parcelas: [
      { numero: 1, valor: 1850.00, mes: "Janeiro" },
      { numero: 2, valor: 1850.00, mes: "Fevereiro" },
      { numero: 3, valor: 1850.00, mes: "Março" },
    ],
  },
  {
    id: 3,
    nome: "Empréstimo Pessoal",
    totalDevido: 8500.00,
    parcelas: [
      { numero: 1, valor: 425.00, mes: "Janeiro" },
      { numero: 2, valor: 425.00, mes: "Fevereiro" },
    ],
  },
];

export default function DashboardClient({ initialDespesas, initialFormasPagamento, initialBancos, saldoTotal }: Props) {
  const router = useRouter();
  const [despesas, setDespesas] = useState(initialDespesas);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  useEffect(() => { setDespesas(initialDespesas); }, [initialDespesas]);

  const getOpcoesPagamento = () =>
    initialFormasPagamento.length > 0
      ? initialFormasPagamento.map(i => ({ value: i.namePayment, label: i.namePayment }))
      : [
        { value: "Dinheiro", label: "Dinheiro" },
        { value: "Cartão de Crédito", label: "Cartão de Crédito" },
        { value: "Cartão de Débito", label: "Cartão de Débito" },
        { value: "Pix", label: "Pix" },
        { value: "Boleto", label: "Boleto" },
      ];

  const getOpcoesBancos = () =>
    initialBancos.length > 0
      ? initialBancos.map(i => ({ value: i.bankName, label: i.bankName }))
      : [
        { value: "Alimentação", label: "Alimentação" },
        { value: "Moradia", label: "Moradia" },
        { value: "Transporte", label: "Transporte" },
        { value: "Lazer", label: "Lazer" },
        { value: "Saúde", label: "Saúde" },
        { value: "Outros", label: "Outros" },
      ];

  const abrirModalCadastro = () => {
    setEditingExpense(null);
    setFormData(emptyForm);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const abrirModalEdicao = (expense: any) => {
    setEditingExpense(expense);
    let formattedDate = new Date().toISOString().split('T')[0];
    if (expense.purchaseDate) {
      const parts = expense.purchaseDate.split('/');
      if (parts.length === 3) formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    setFormData({
      purchaseName: expense.purchaseName || "",
      purchaseValue: String(expense.purchaseValue || ""),
      bankName: expense.bankName || "",
      purchaseTypePayment: expense.purchaseTypePayment || "",
      purchaseDate: formattedDate,
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const salvarDespesaAsync = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.purchaseName.trim() || !formData.purchaseValue || !formData.bankName || !formData.purchaseTypePayment || !formData.purchaseDate) {
      setErrorMsg("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const valorNumerico = parseFloat(formData.purchaseValue.replace(",", "."));
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      setErrorMsg("Por favor, insira um valor válido maior que zero.");
      return;
    }

    setSaving(true);
    try {
      const dateParts = formData.purchaseDate.split('-');
      const monthPayment = dateParts.length > 1 ? parseInt(dateParts[1], 10) : new Date().getMonth() + 1;
      const payload = {
        purchaseName: formData.purchaseName,
        purchaseValue: valorNumerico,
        bankName: formData.bankName,
        purchaseTypePayment: formData.purchaseTypePayment,
        purchaseDate: formData.purchaseDate,
        monthPayment,
      };

      if (editingExpense) {
        await alteraDespesaExtra({ ...payload, id: editingExpense.id });
      } else {
        await cadastraDespesaExtra(payload);
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (error: any) {
      setErrorMsg(error.message || "Ocorreu um erro ao salvar a despesa. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const deletarDespesaAsync = async (id: string) => {
    try {
      await deletaDespesa(id);
      router.refresh();
    } catch (error) {
      console.error("Erro ao deletar despesa:", error);
    }
  };

  const formatBRL = (v: any) => parseFloat(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-6 lg:ml-[60px]">


      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        <DashboardCard
          title="Compras parceladas"
          value={formatBRL(saldoTotal)}
          icon={<Landmark size={20} />}
          backgroundClass="bg-red-500/20 text-red-400"
        />
        <DashboardCard
          title="Gastos do mês"
          value={formatBRL(saldoTotal)}
          icon={<DollarSign size={20} />}
          backgroundClass="bg-primary-500/20 text-primary-400"
        />
        <DashboardCard
          title="Gastos fixos"
          value="R$ 1.250,50"
          icon={<ShoppingCart size={20} />}
          backgroundClass="bg-blue-500/20 text-blue-400"
        />
        <DashboardCard
          title="Endividamento total"
          value={formatBRL(saldoTotal)}
          icon={<Landmark size={20} />}
          backgroundClass="bg-red-500/20 text-red-400"
        />
      </div>


      <div className="w-full">
        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-2 gap-5 mb-10">


          <div>
            <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-700/60 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-white">Gastos do mês</h2>
                </div>
                <button className="flex items-center gap-1.5 text-sm font-semibold text-white bg-primary-700 hover:bg-primary-600 px-3.5 py-2 rounded-lg transition-all">
                  <CirclePlus size={15} />
                  Adicionar
                </button>
              </div>

              <div className="p-4 space-y-2">
                {despesasFixasMock.map((despesa) => {
                  return (
                    <div key={despesa.id}>

                      <span className="font-semibold text-slate-200 text-sm">{despesa.nome}</span>


                      <div className="flex items-center justify-end gap-3">
                        <span className="text-sm font-semibold text-white">
                          R$ 300,00
                        </span>
                        <button className="text-slate-600 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-500/10">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div >
            <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-700/60 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-white">Despesa Fixas</h2>
                </div>
                <button className="flex items-center gap-1.5 text-sm font-semibold text-white bg-primary-700 hover:bg-primary-600 px-3.5 py-2 rounded-lg transition-all">
                  <CirclePlus size={15} />
                  Adicionar
                </button>
              </div>

              <div className="p-4 space-y-2">
                {despesasFixasMock.map((despesa) => {
                  return (
                    <div key={despesa.id}>

                      <span className="font-semibold text-slate-200 text-sm">{despesa.nome}</span>


                      <div className="flex items-center justify-end gap-3">
                        <span className="text-sm font-semibold text-white">
                          R$ 300,00
                        </span>
                        <button className="text-slate-600 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-500/10">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        <div className="xl:col-span-2 mb-10">
          <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700/60 flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-white">Compras Parceladas</h2>
              </div>
              <button className="flex items-center gap-1.5 text-sm font-semibold text-white bg-primary-700 hover:bg-primary-600 px-3.5 py-2 rounded-lg transition-all">
                <CirclePlus size={15} />
                Adicionar
              </button>
            </div>

            <div className="p-4 space-y-2">
              {despesasFixasMock.map((despesa) => {
                const isOpen = openAccordion === despesa.id;
                return (
                  <div key={despesa.id} className="rounded-lg border border-slate-700/50 overflow-hidden">
                    <button
                      onClick={() => setOpenAccordion(isOpen ? null : despesa.id)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 hover:bg-slate-700/60 transition-colors"
                    >
                      <span className="font-semibold text-slate-200 text-sm">{despesa.nome}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-white">
                          {despesa.totalDevido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-slate-700/50">
                        <div className="grid grid-cols-3 px-4 py-2 bg-slate-900/60 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          <span>Parcela</span>
                          <span className="text-center">Mês</span>
                          <span className="text-right">Valor</span>
                        </div>
                        <div className="divide-y divide-slate-700/40">
                          {despesa.parcelas.map((parcela) => (
                            <div key={parcela.numero} className="grid grid-cols-3 items-center px-4 py-2.5 hover:bg-slate-700/30 transition-colors">
                              <span className="text-sm text-slate-400 font-medium">#{parcela.numero}</span>
                              <span className="text-sm text-slate-300 text-center">{parcela.mes}</span>
                              <div className="flex items-center justify-end gap-3">
                                <span className="text-sm font-semibold text-white">
                                  {parcela.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                                <button className="text-slate-600 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-500/10">
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>



      </div>

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} size="md" popup root={typeof window !== 'undefined' ? document.body : undefined}>
        <ModalBody className="p-6 bg-slate-800 rounded-xl border border-slate-700">
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {editingExpense ? <><SquarePen className="text-primary-400" size={20} /> Editar Despesa</> : <><CirclePlus className="text-primary-400" size={20} /> Nova Despesa</>}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={salvarDespesaAsync} className="space-y-4">
              {errorMsg && (
                <div className="p-3 text-sm text-red-300 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  {errorMsg}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="purchaseName" className="font-semibold text-slate-300 text-sm flex items-center gap-1.5">
                  <FileText size={14} className="text-slate-400" /> Descrição *
                </Label>
                <TextInput id="purchaseName" placeholder="Ex: Supermercado, Aluguel, Uber" value={formData.purchaseName} onChange={(e) => setFormData({ ...formData, purchaseName: e.target.value })} required className="[&_input]:bg-slate-900 [&_input]:border-slate-600 [&_input]:text-white [&_input]:placeholder-slate-500 [&_input]:focus:border-primary-500 [&_input]:focus:ring-primary-500/20" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="purchaseValue" className="font-semibold text-slate-300 text-sm flex items-center gap-1.5">
                    <DollarSign size={14} className="text-slate-400" /> Valor (R$) *
                  </Label>
                  <TextInput id="purchaseValue" type="text" placeholder="0,00" value={formData.purchaseValue} onChange={(e) => setFormData({ ...formData, purchaseValue: e.target.value })} required className="[&_input]:bg-slate-900 [&_input]:border-slate-600 [&_input]:text-white [&_input]:placeholder-slate-500 [&_input]:focus:border-primary-500" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="purchaseDate" className="font-semibold text-slate-300 text-sm flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-400" /> Data *
                  </Label>
                  <TextInput id="purchaseDate" type="date" value={formData.purchaseDate} onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })} required className="[&_input]:bg-slate-900 [&_input]:border-slate-600 [&_input]:text-white [&_input]:focus:border-primary-500" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bankName" className="font-semibold text-slate-300 text-sm flex items-center gap-1.5">
                  <Landmark size={14} className="text-slate-400" /> Categoria / Banco *
                </Label>
                <Select id="bankName" value={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} required className="[&_select]:bg-slate-900 [&_select]:border-slate-600 [&_select]:text-white [&_select]:focus:border-primary-500">
                  <option value="">Selecione...</option>
                  {getOpcoesBancos().map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="purchaseTypePayment" className="font-semibold text-slate-300 text-sm flex items-center gap-1.5">
                  <ShoppingCart size={14} className="text-slate-400" /> Forma de Pagamento *
                </Label>
                <Select id="purchaseTypePayment" value={formData.purchaseTypePayment} onChange={(e) => setFormData({ ...formData, purchaseTypePayment: e.target.value })} required className="[&_select]:bg-slate-900 [&_select]:border-slate-600 [&_select]:text-white [&_select]:focus:border-primary-500">
                  <option value="">Selecione...</option>
                  {getOpcoesPagamento().map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </Select>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-700">
                <Button type="button" color="gray" onClick={() => setIsModalOpen(false)} disabled={saving} className="font-medium bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600">Cancelar</Button>
                <Button type="submit" disabled={saving} className="bg-primary-700 hover:bg-primary-600 text-white font-bold px-4 border-0">
                  {saving ? <><Spinner size="sm" className="mr-2" /> Salvando...</> : <><CheckCircle2 size={15} className="mr-2" /> Salvar</>}
                </Button>
              </div>
            </form>
          </div>
        </ModalBody>
      </Modal>
    </div >
  );
}
