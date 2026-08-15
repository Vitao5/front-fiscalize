"use client";

import { DashboardCard } from "@/components/DashboardCard";
import { ModalDespesa } from "@/components/ModalDespesa";
import { ModalCompraParcelada } from "@/components/ModalCompraParcelada";
import { ModalDespesaFixa } from "@/components/ModalDespesaFixa";
import { CirclePlus, DollarSign, Landmark, ShoppingCart, SquarePen, Trash2, ChevronDown, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cadastraDespesaExtra, alteraDespesaExtra, deletaDespesaExtra, buscaDespesasExtras, cadastrarCompraParcelada, alteraCompraParcelada, deletaCompraParcelada, deletaParcelaIndividual, cadastraDespesaFixa, alteraDespesaFixa, deletaDespesaFixa, buscaDespesasFixas, buscaComprasParceladas } from "./dashboard-action";
import { parseBRLToFloat } from "@/comum-functions";



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
  initialComprasParceladas?: any[];
  initialDespesasFixas?: any[];
  saldoTotal: number;
}

const emptyFormFixa = {
  name: "",
  value: "",
  dayMaxPayment: "",
};

export default function DashboardClient({ initialDespesas, initialFormasPagamento, initialBancos, initialComprasParceladas = [], initialDespesasFixas = [], saldoTotal }: Props) {
  const router = useRouter();
  const [despesas, setDespesas] = useState(initialDespesas);
  const [comprasParceladas, setComprasParceladas] = useState(initialComprasParceladas);
  const [despesasFixas, setDespesasFixas] = useState(initialDespesasFixas);
  const [endividamentoTotal, setEndividamentoTotal] = useState(0);
  const [saldoTotalComprasParceladas, setSaldoTotalComprasParceladas] = useState(0);
  const [saldoTotalDespesasFixas, setSaldoTotalDespesasFixas] = useState(0);
  const [gastosProximoMes, setGastosProximoMes] = useState(0);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const [isModalParceladaOpen, setIsModalParceladaOpen] = useState(false);
  const [editingParcelada, setEditingParcelada] = useState<any | null>(null);
  const [formParcelada, setFormParcelada] = useState({ description: "", quantityInstallments: "", installmentValue: "" });

  const [openAccordion, setOpenAccordion] = useState<number | string | null>(null);

  const [isModalFixaOpen, setIsModalFixaOpen] = useState(false);
  const [editingDespesaFixa, setEditingDespesaFixa] = useState<any | null>(null);
  const [formDespesaFixa, setFormDespesaFixa] = useState(emptyFormFixa);

  // Pagination states
  const [pageGastosMes, setPageGastosMes] = useState(1);
  const [pageFixos, setPageFixos] = useState(1);
  const [pageParceladas, setPageParceladas] = useState(1);

  const LIMIT_GASTOS_MES = 3;
  const LIMIT_FIXOS = 5;
  const LIMIT_PARCELADAS = 6;

  useEffect(() => { setDespesas(initialDespesas); setPageGastosMes(1); }, [initialDespesas]);
  useEffect(() => { setComprasParceladas(initialComprasParceladas); setPageParceladas(1); }, [initialComprasParceladas]);
  useEffect(() => { setDespesasFixas(initialDespesasFixas); setPageFixos(1); }, [initialDespesasFixas]);

  useEffect(() => {
    const totalParceladas = comprasParceladas.reduce((sum: number, compra: any) => {
      const parcelas = compra.installments || [];
      const totalCompra = parcelas.reduce((s: number, p: any) => s + parseFloat(p.installmentValue || 0), 0);
      return sum + totalCompra;
    }, 0);

    const totalGastosMes = despesas.reduce((sum: number, d: any) => sum + parseFloat(d.purchaseValue || 0), 0);

    const totalFixas = despesasFixas.reduce((sum: number, d: any) => sum + parseFloat(d.value || 0), 0);

    const umaParcelaDeCada = comprasParceladas.reduce((sum: number, compra: any) => {
      return sum + parseFloat(compra.installmentValue || 0);
    }, 0);

    const gastosCartaoCredito = despesas.reduce((sum: number, d: any) => {
      if (d.purchaseTypePayment === 'Cartão de Crédito') {
        return sum + parseFloat(d.purchaseValue || 0);
      }
      return sum;
    }, 0);

    setGastosProximoMes(totalFixas + umaParcelaDeCada + gastosCartaoCredito);
    setEndividamentoTotal(totalParceladas + totalGastosMes + totalFixas);
    setSaldoTotalComprasParceladas(totalParceladas);
    setSaldoTotalDespesasFixas(totalFixas);
  }, [comprasParceladas, despesas, despesasFixas]);

  const abrirModalCadastroParcelada = () => {
    setEditingParcelada(null);
    setFormParcelada({ description: "", quantityInstallments: "", installmentValue: "" });
    setErrorMsg("");
    setIsModalParceladaOpen(true);
  };

  const abrirModalEdicaoParcelada = (compra: any) => {
    setEditingParcelada(compra);
    setFormParcelada({
      description: compra.description || "",
      quantityInstallments: String(compra.quantityInstallments || ""),
      installmentValue: String(compra.installmentValue || ""),
    });
    setErrorMsg("");
    setIsModalParceladaOpen(true);
  };

  const salvarCompraParceladaAsync = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formParcelada.description.trim() || !formParcelada.quantityInstallments || !formParcelada.installmentValue) {
      setErrorMsg("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const valorNumerico = parseBRLToFloat(formParcelada.installmentValue);
    const qtdeParcelas = parseInt(formParcelada.quantityInstallments, 10);

    if (isNaN(valorNumerico) || valorNumerico <= 0 || isNaN(qtdeParcelas) || qtdeParcelas <= 0) {
      setErrorMsg("Por favor, insira valores válidos e maiores que zero.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        description: formParcelada.description,
        quantityInstallments: qtdeParcelas,
        installmentValue: valorNumerico,
      };

      if (editingParcelada) {
        await alteraCompraParcelada({ ...payload, id: editingParcelada.id });
      } else {
        await cadastrarCompraParcelada(payload);
      }

      setIsModalParceladaOpen(false);
      const novasParceladas = await buscaComprasParceladas();
      setComprasParceladas(novasParceladas);
      router.refresh();
    } catch (error: any) {
      setErrorMsg(error.message || "Ocorreu um erro ao salvar a compra parcelada. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const deletarCompraParceladaAsync = async (id: string) => {

    try {
      await deletaCompraParcelada(id);
      const novasParceladas = await buscaComprasParceladas();
      setComprasParceladas(novasParceladas);
      router.refresh();
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  const deletarParcelaIndividualAsync = async (installmentId: number | string) => {

    try {
      await deletaParcelaIndividual(installmentId);
      const novasParceladas = await buscaComprasParceladas();
      setComprasParceladas(novasParceladas);
      router.refresh();
    } catch (error) {
      console.error("Erro ao deletar parcela:", error);
    }
  };

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


  const salvarDespesaAsync = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.purchaseName.trim() || !formData.purchaseValue || !formData.bankName || !formData.purchaseTypePayment || !formData.purchaseDate) {
      setErrorMsg("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const valorNumerico = parseBRLToFloat(formData.purchaseValue);
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
      const novasDespesas = await buscaDespesasExtras();
      setDespesas(novasDespesas);
      router.refresh();
    } catch (error: any) {
      setErrorMsg(error.message || "Ocorreu um erro ao salvar a despesa. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const abrirModalCadastroFixa = () => {
    setEditingDespesaFixa(null);
    setFormDespesaFixa(emptyFormFixa);
    setErrorMsg("");
    setIsModalFixaOpen(true);
  };

  const abrirModalEdicaoFixa = (despesa: any) => {
    setEditingDespesaFixa(despesa);
    setFormDespesaFixa({
      name: despesa.name || "",
      value: String(despesa.value || ""),
      dayMaxPayment: String(despesa.dayMaxPayment || ""),
    });
    setErrorMsg("");
    setIsModalFixaOpen(true);
  };

  const salvarDespesaFixaAsync = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formDespesaFixa.name.trim() || !formDespesaFixa.value || !formDespesaFixa.dayMaxPayment) {
      setErrorMsg("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const valorNumerico = parseBRLToFloat(formDespesaFixa.value);
    const dia = parseInt(formDespesaFixa.dayMaxPayment, 10);

    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      setErrorMsg("Por favor, insira um valor válido maior que zero.");
      return;
    }
    if (isNaN(dia) || dia < 1 || dia > 31) {
      setErrorMsg("O dia de vencimento deve ser entre 1 e 31.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formDespesaFixa.name,
        value: valorNumerico,
        dayMaxPayment: dia,
        paymentMonth: false,
      };

      if (editingDespesaFixa) {
        await alteraDespesaFixa({ ...payload, id: editingDespesaFixa.id });
      } else {
        await cadastraDespesaFixa(payload);
      }

      setIsModalFixaOpen(false);
      const novasFixas = await buscaDespesasFixas();
      setDespesasFixas(novasFixas);
      router.refresh();
    } catch (error: any) {
      setErrorMsg(error.message || "Ocorreu um erro ao salvar a despesa fixa. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const deletarDespesaFixaAsync = async (id: string) => {
    try {
      await deletaDespesaFixa(id);
      const novasFixas = await buscaDespesasFixas();
      setDespesasFixas(novasFixas);
      router.refresh();
    } catch (error) {
      console.error("Erro ao deletar despesa fixa:", error);
    }
  };

  const formatBRL = (v: any) => parseFloat(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-6 lg:ml-[60px]">


      <div className="flex justify-between">
        <DashboardCard
          title="Compras parceladas"
          value={formatBRL(saldoTotalComprasParceladas)}
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
          title="Gastos próximo mês"
          value={formatBRL(gastosProximoMes)}
          icon={<Calendar size={20} />}
          backgroundClass="bg-red-500/20 text-red-400"
        />

        <DashboardCard
          title="Gastos fixos"
          value={formatBRL(saldoTotalDespesasFixas)}
          icon={<ShoppingCart size={20} />}
          backgroundClass="bg-blue-500/20 text-blue-400"
        />
        <DashboardCard
          title="Endividamento total"
          value={formatBRL(endividamentoTotal)}
          icon={<Landmark size={20} />}
          backgroundClass="bg-red-500/20 text-red-400"
        />
      </div>


      <div className="w-full">
        <div className="grid grid-cols-1  md:grid-cols-1 xl:grid-cols-3 gap-5 mb-10">


          <div>
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h2 className="text-base  font-bold text-gray-900">Gastos do mês</h2>
                </div>

                <button onClick={() => {
                  setEditingExpense(null);
                  setFormData(emptyForm);
                  setErrorMsg("");
                  setIsModalOpen(true);
                }} className="flex items-center gap-1.5 text-sm font-semibold text-white bg-primary-700 hover:bg-primary-600 px-3.5 py-2 rounded-lg transition-all">
                  <CirclePlus size={15} />
                  Adicionar
                </button>
              </div>

              <div className="p-4 space-y-2">
                {despesas.length === 0 ? (
                  <div className="text-gray-400 text-sm text-center py-4">Nenhum gasto registrado neste mês.</div>
                ) : despesas.slice((pageGastosMes - 1) * LIMIT_GASTOS_MES, pageGastosMes * LIMIT_GASTOS_MES).map((despesa) => (
                  <div key={despesa.id} className="flex items-center justify-between py-2">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-700 ">{despesa.purchaseName} - {despesa.purchaseTypePayment}</span>
                      <span className="text-gray-400">{despesa.purchaseDate}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatBRL(despesa.purchaseValue)}
                      </span>
                      <button onClick={() => {
                        setEditingExpense(despesa);
                        setFormData({
                          purchaseName: despesa.purchaseName || "",
                          purchaseValue: String(despesa.purchaseValue || ""),
                          bankName: despesa.bankName || "",
                          purchaseTypePayment: despesa.purchaseTypePayment || "",
                          purchaseDate: despesa.purchaseDate ? despesa.purchaseDate.split('/').reverse().join('-') : new Date().toISOString().split('T')[0],
                        });
                        setErrorMsg("");
                        setIsModalOpen(true);
                      }} className="text-gray-400 hover:text-primary-600 transition-colors p-1 rounded hover:bg-primary-50">
                        <SquarePen size={14} />
                      </button>
                      <button onClick={async () => { await deletaDespesaExtra(despesa.id); const novas = await buscaDespesasExtras(); setDespesas(novas); router.refresh(); }} className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {despesas.length > LIMIT_GASTOS_MES && (
                <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between">
                  <button
                    onClick={() => setPageGastosMes(p => Math.max(1, p - 1))}
                    disabled={pageGastosMes === 1}
                    className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-2 py-1 rounded hover:bg-gray-100"
                  >
                    <ChevronLeft size={16} />
                    Anterior
                  </button>
                  <span className="text-sm text-gray-500">
                    {pageGastosMes} / {Math.ceil(despesas.length / LIMIT_GASTOS_MES)}
                  </span>
                  <button
                    onClick={() => setPageGastosMes(p => Math.min(Math.ceil(despesas.length / LIMIT_GASTOS_MES), p + 1))}
                    disabled={pageGastosMes >= Math.ceil(despesas.length / LIMIT_GASTOS_MES)}
                    className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-2 py-1 rounded hover:bg-gray-100"
                  >
                    Próximo
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Gastos fixos</h2>
                </div>
                <button onClick={abrirModalCadastroFixa} className="flex items-center gap-1.5 text-sm font-semibold text-white bg-primary-700 hover:bg-primary-600 px-3.5 py-2 rounded-lg transition-all">
                  <CirclePlus size={15} />
                  Adicionar
                </button>
              </div>

              <div className="p-4 space-y-2">
                {despesasFixas.length === 0 ? (
                  <div className="text-gray-400 text-sm text-center py-4">Nenhum gasto fixo cadastrado.</div>
                ) : despesasFixas.slice((pageFixos - 1) * LIMIT_FIXOS, pageFixos * LIMIT_FIXOS).map((despesa) => (
                  <div key={despesa.id} className="flex items-center justify-between py-2">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-700">{despesa.name}</span>
                      <span className="text-gray-400">Vence todo dia {despesa.dayMaxPayment}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatBRL(despesa.value)}
                      </span>
                      <button onClick={() => abrirModalEdicaoFixa(despesa)} className="text-gray-400 hover:text-primary-600 transition-colors p-1 rounded hover:bg-primary-50">
                        <SquarePen size={14} />
                      </button>
                      <button onClick={() => deletarDespesaFixaAsync(despesa.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {despesasFixas.length > LIMIT_FIXOS && (
                <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between">
                  <button
                    onClick={() => setPageFixos(p => Math.max(1, p - 1))}
                    disabled={pageFixos === 1}
                    className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-2 py-1 rounded hover:bg-gray-100"
                  >
                    <ChevronLeft size={16} />
                    Anterior
                  </button>
                  <span className="text-sm text-gray-500">
                    {pageFixos} / {Math.ceil(despesasFixas.length / LIMIT_FIXOS)}
                  </span>
                  <button
                    onClick={() => setPageFixos(p => Math.min(Math.ceil(despesasFixas.length / LIMIT_FIXOS), p + 1))}
                    disabled={pageFixos >= Math.ceil(despesasFixas.length / LIMIT_FIXOS)}
                    className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-2 py-1 rounded hover:bg-gray-100"
                  >
                    Próximo
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-gray-900">Compras Parceladas</h2>
              </div>
              <button onClick={abrirModalCadastroParcelada} className="flex items-center gap-1.5 text-sm font-semibold text-white bg-primary-700 hover:bg-primary-600 px-3.5 py-2 rounded-lg transition-all">
                <CirclePlus size={15} />
                Adicionar
              </button>
            </div>

            <div className="p-4 space-y-2">
              {comprasParceladas.length === 0 ? (
                <div className="text-gray-400 text-sm text-center py-4">Nenhuma compra parcelada cadastrada.</div>
              ) : comprasParceladas.slice((pageParceladas - 1) * LIMIT_PARCELADAS, pageParceladas * LIMIT_PARCELADAS).map((compra) => {
                const isOpen = openAccordion === compra.id;


                const parcelasArray = compra.installments.reverse() || []

                let total = 0;
                parcelasArray.forEach((p: any) => {
                  total += parseFloat(p.installmentValue || 0);
                });

                return (
                  <div key={compra.id} className="rounded-lg border border-gray-200 overflow-hidden">
                    <div className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                      <button
                        onClick={() => setOpenAccordion(isOpen ? null : compra.id)}
                        className="flex-1 text-left flex items-center gap-2"
                      >
                        <span className="font-semibold text-gray-700 text-sm">{compra.description || "Sem descrição"}</span>
                        <ChevronDown
                          size={16}
                          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-gray-900">
                          {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                        <div className="flex gap-1">
                          <button onClick={() => abrirModalEdicaoParcelada(compra)} className="text-gray-400 hover:text-primary-600 transition-colors p-1.5 rounded hover:bg-primary-50">
                            <SquarePen size={20} />
                          </button>
                          <button onClick={() => deletarCompraParceladaAsync(compra.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded hover:bg-red-50">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="border-t border-gray-200">
                        <div className="grid grid-cols-2 px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          <span>Parcela</span>
                          <span className="text-right">Ação / Valor</span>
                        </div>
                        <div className="divide-y divide-gray-100">
                          {parcelasArray.map((parcela: any) => (
                            <div key={parcela.id} className="grid grid-cols-2 items-center px-4 py-2.5 hover:bg-gray-50 transition-colors">
                              <span className="text-sm text-gray-500 font-medium">{parcela.installmentNumber} de {compra.quantityInstallments}</span>
                              <div className="flex items-center justify-end gap-3">
                                <span className="text-sm font-semibold text-gray-900">
                                  {(parcela.installmentValue || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                                <button onClick={() => deletarParcelaIndividualAsync(parcela.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50">
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
            {comprasParceladas.length > LIMIT_PARCELADAS && (
              <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => setPageParceladas(p => Math.max(1, p - 1))}
                  disabled={pageParceladas === 1}
                  className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-2 py-1 rounded hover:bg-gray-100"
                >
                  <ChevronLeft size={16} />
                  Anterior
                </button>
                <span className="text-sm text-gray-500">
                  {pageParceladas} / {Math.ceil(comprasParceladas.length / LIMIT_PARCELADAS)}
                </span>
                <button
                  onClick={() => setPageParceladas(p => Math.min(Math.ceil(comprasParceladas.length / LIMIT_PARCELADAS), p + 1))}
                  disabled={pageParceladas >= Math.ceil(comprasParceladas.length / LIMIT_PARCELADAS)}
                  className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-2 py-1 rounded hover:bg-gray-100"
                >
                  Próximo
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>





      </div>

      <ModalCompraParcelada
        isOpen={isModalParceladaOpen}
        onClose={() => setIsModalParceladaOpen(false)}
        editingParcelada={editingParcelada}
        formParcelada={formParcelada}
        setFormParcelada={setFormParcelada}
        onSubmit={salvarCompraParceladaAsync}
        saving={saving}
        errorMsg={errorMsg}
      />

      <ModalDespesa
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingExpense={editingExpense}
        formData={formData}
        setFormData={setFormData}
        onSubmit={salvarDespesaAsync}
        saving={saving}
        errorMsg={errorMsg}
        opcoesBancos={getOpcoesBancos()}
        opcoesPagamento={getOpcoesPagamento()}
      />

      <ModalDespesaFixa
        isOpen={isModalFixaOpen}
        onClose={() => setIsModalFixaOpen(false)}
        editingDespesaFixa={editingDespesaFixa}
        formDespesaFixa={formDespesaFixa}
        setFormDespesaFixa={setFormDespesaFixa}
        onSubmit={salvarDespesaFixaAsync}
        saving={saving}
        errorMsg={errorMsg}
      />
    </div >
  );
}
