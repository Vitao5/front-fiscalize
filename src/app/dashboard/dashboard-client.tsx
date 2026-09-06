"use client";

import { DashboardCard } from "@/components/DashboardCard";
import { ModalDespesa } from "@/components/ModalDespesa";
import { ModalCompraParcelada } from "@/components/ModalCompraParcelada";
import { ModalDespesaFixa } from "@/components/ModalDespesaFixa";
import { PluggyOnboardingModal } from "@/components/PluggyOnboardingModal";
import {
  CirclePlus,
  DollarSign,
  Landmark,
  ShoppingCart,
  SquarePen,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Wallet,
  CreditCard,
  RefreshCw,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Building2,
  Plus
} from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  cadastraDespesaExtra,
  alteraDespesaExtra,
  deletaDespesaExtra,
  buscaDespesasExtras,
  cadastrarCompraParcelada,
  alteraCompraParcelada,
  deletaCompraParcelada,
  deletaParcelaIndividual,
  cadastraDespesaFixa,
  alteraDespesaFixa,
  deletaDespesaFixa,
  buscaDespesasFixas,
  buscaComprasParceladas
} from "./dashboard-action";
import {
  buscarDadosDashboardPluggy,
  sincronizarDadosPluggy
} from "./pluggy-actions";
import { parseBRLToFloat } from "@/comum-functions";

const emptyForm = {
  purchaseName: "",
  purchaseValue: "",
  bankName: "",
  purchaseTypePayment: "",
  purchaseDate: new Date().toISOString().split('T')[0],
};

const emptyFormFixa = {
  name: "",
  value: "",
  dayMaxPayment: "",
};

interface AccountPluggy {
  id: string;
  pluggyItemId: string;
  connectorName: string;
  name: string;
  type: string;
  subtype?: string;
  number?: string;
  balance: number;
  currencyCode?: string;
  creditData?: any;
}

interface TransactionPluggy {
  id: string;
  description: string;
  amount: number;
  date: string;
  category?: string;
  type?: string;
  pluggyItemId: string;
  connectorName: string;
}

interface DadosPluggy {
  saldoTotalContas: number;
  totalFaturasCartao: number;
  totalGastosMesPluggy: number;
  contas: AccountPluggy[];
  transacoes: TransactionPluggy[];
  itensConectados: any[];
}

interface Props {
  initialDespesas: any[];
  initialFormasPagamento: any[];
  initialBancos: any[];
  initialComprasParceladas?: any[];
  initialDespesasFixas?: any[];
  saldoTotal: number;
  onboardingCompleted?: boolean;
  initialDadosPluggy?: DadosPluggy;
}

export default function DashboardClient({
  initialDespesas,
  initialFormasPagamento,
  initialBancos,
  initialComprasParceladas = [],
  initialDespesasFixas = [],
  saldoTotal,
  onboardingCompleted = true,
  initialDadosPluggy = {
    saldoTotalContas: 0,
    totalFaturasCartao: 0,
    totalGastosMesPluggy: 0,
    contas: [],
    transacoes: [],
    itensConectados: []
  }
}: Props) {
  const router = useRouter();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(!onboardingCompleted);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  const [dadosPluggy, setDadosPluggy] = useState<DadosPluggy>(initialDadosPluggy);
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
  const [pageTx, setPageTx] = useState(1);
  const [searchTx, setSearchTx] = useState("");

  const LIMIT_GASTOS_MES = 3;
  const LIMIT_FIXOS = 5;
  const LIMIT_PARCELADAS = 6;
  const LIMIT_TX = 5;

  useEffect(() => { setDespesas(initialDespesas); setPageGastosMes(1); }, [initialDespesas]);
  useEffect(() => { setComprasParceladas(initialComprasParceladas); setPageParceladas(1); }, [initialComprasParceladas]);
  useEffect(() => { setDespesasFixas(initialDespesasFixas); setPageFixos(1); }, [initialDespesasFixas]);
  useEffect(() => { setIsOnboardingOpen(!onboardingCompleted); }, [onboardingCompleted]);
  useEffect(() => { setDadosPluggy(initialDadosPluggy); }, [initialDadosPluggy]);

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
    // Endividamento total = parceladas pendentes + faturas de cartão do Open Finance + gastos fixos
    const faturaOpenFinance = dadosPluggy?.totalFaturasCartao || 0;
    setEndividamentoTotal(totalParceladas + faturaOpenFinance + totalGastosMes + totalFixas);
    setSaldoTotalComprasParceladas(totalParceladas);
    setSaldoTotalDespesasFixas(totalFixas);
  }, [comprasParceladas, despesas, despesasFixas, dadosPluggy]);

  const handleSyncPluggy = async () => {
    setIsSyncing(true);
    setSyncMessage("");
    try {
      await sincronizarDadosPluggy();
      const updated = await buscarDadosDashboardPluggy();
      setDadosPluggy(updated);
      setSyncMessage("Dados sincronizados com sucesso!");
      setTimeout(() => setSyncMessage(""), 4000);
      router.refresh();
    } catch (err: any) {
      setSyncMessage("Erro ao sincronizar dados. Tente novamente.");
      setTimeout(() => setSyncMessage(""), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

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
    const diaVenc = parseInt(formDespesaFixa.dayMaxPayment, 10);

    if (isNaN(valorNumerico) || valorNumerico <= 0 || isNaN(diaVenc) || diaVenc < 1 || diaVenc > 31) {
      setErrorMsg("Por favor, insira valores válidos.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formDespesaFixa.name,
        value: valorNumerico,
        dayMaxPayment: diaVenc,
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

  const filteredTransactions = useMemo(() => {
    const txs = dadosPluggy?.transacoes || [];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();


    const mesVigenteTxs = txs.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    if (!searchTx.trim()) return mesVigenteTxs;
    const term = searchTx.toLowerCase();
    return mesVigenteTxs.filter(
      (t) =>
        t.description.toLowerCase().includes(term) ||
        (t.category && t.category.toLowerCase().includes(term)) ||
        (t.connectorName && t.connectorName.toLowerCase().includes(term))
    );
  }, [dadosPluggy?.transacoes, searchTx]);

  const totalDespesasManuais = useMemo(() => {
    return despesas.reduce((sum: number, d: any) => sum + parseFloat(d.purchaseValue || 0), 0);
  }, [despesas]);

  const totalGastosMesConsolidado = useMemo(() => {
    return (dadosPluggy?.totalGastosMesPluggy || 0) + totalDespesasManuais + saldoTotalDespesasFixas;
  }, [dadosPluggy?.totalGastosMesPluggy, totalDespesasManuais, saldoTotalDespesasFixas]);

  return (
    <div className="space-y-6 lg:ml-[60px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard
          title="Saldo em Contas"
          value={formatBRL(dadosPluggy?.saldoTotalContas || 0)}
          icon={<Wallet size={20} />}
          backgroundClass="bg-emerald-500/20 text-emerald-600"
        />

        <DashboardCard
          title="Faturas de Cartão"
          value={formatBRL(dadosPluggy?.totalFaturasCartao || 0)}
          icon={<CreditCard size={20} />}
          backgroundClass="bg-purple-500/20 text-purple-600"
        />

        <DashboardCard
          title="Gastos do Mês"
          value={formatBRL(totalGastosMesConsolidado)}
          icon={<DollarSign size={20} />}
          backgroundClass="bg-orange-500/20 text-orange-500"
        />

        <DashboardCard
          title="Gastos Fixos"
          value={formatBRL(saldoTotalDespesasFixas)}
          icon={<ShoppingCart size={20} />}
          backgroundClass="bg-blue-500/20 text-blue-500"
        />

        <DashboardCard
          title="Endividamento Total"
          value={formatBRL(endividamentoTotal)}
          icon={<Landmark size={20} />}
          backgroundClass="bg-red-500/20 text-red-500"
        />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-700">
              <Building2 size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                Contas & Instituições Conectadas
                <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Open Finance
                </span>
              </h2>
              <p className="text-xs text-gray-500">
                Saldos sincronizados diretamente dos seus bancos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncPluggy}
              disabled={isSyncing}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 px-3.5 py-2 rounded-xl transition-all"
            >
              <RefreshCw size={14} className={isSyncing ? "animate-spin text-green-600" : ""} />
              {isSyncing ? "Sincronizando..." : "Sincronizar"}
            </button>

            <button
              onClick={() => setIsConnectModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-primary-700 hover:bg-primary-600 px-3.5 py-2 rounded-xl transition-all shadow-sm"
            >
              <Plus size={14} />
              Conectar Banco
            </button>
          </div>
        </div>

        {(!dadosPluggy?.contas || dadosPluggy.contas.length === 0) ? (
          <div className="py-6 text-center text-gray-400 text-sm">
            Nenhuma conta conectada no momento. Clique em "Conectar Banco" para vincular.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {dadosPluggy.contas.map((acc) => {
              const isCredit = acc.type === 'CREDIT' || acc.subtype === 'CREDIT_CARD';
              return (
                <div
                  key={acc.id}
                  className="p-4 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-gray-50 transition-colors flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                        {isCredit ? <CreditCard size={16} className="text-purple-600" /> : <Wallet size={16} className="text-emerald-600" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{acc.connectorName}</p>
                        <p className="text-[11px] text-gray-500 truncate">{acc.name || (isCredit ? "Cartão de Crédito" : "Conta Corrente")}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-green-700 bg-green-100 px-1.5 py-0.5 rounded">
                      Ativo
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {isCredit ? "Fatura Atual:" : "Saldo Disponível:"}
                    </span>
                    <p className={`text-base font-bold 
                      ${isCredit && acc.balance < 0 ? "text-red-700" : "text-green-700"}`}>
                      {formatBRL(isCredit ? acc.balance * -1 : acc.balance)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row lg:justify-between gap-5">


        <div className="w-full lg:w-[40%] order-2 lg:order-1">
          <div className="">
            <div className="mb-5">
              <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">Despesas Manuais</h2>
                  </div>
                  <button
                    onClick={() => {
                      setEditingExpense(null);
                      setFormData(emptyForm);
                      setErrorMsg("");
                      setIsModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-white bg-primary-700 hover:bg-primary-600 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <CirclePlus size={14} /> Adicionar
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  {despesas.length === 0 ? (
                    <div className="text-gray-400 text-sm text-center py-4">Nenhuma despesa manual registrada.</div>
                  ) : (
                    despesas
                      .slice((pageGastosMes - 1) * LIMIT_GASTOS_MES, pageGastosMes * LIMIT_GASTOS_MES)
                      .map((despesa) => (
                        <div key={despesa.id} className="flex items-center justify-between py-2">
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm text-gray-700">
                              {despesa.purchaseName} - {despesa.purchaseTypePayment}
                            </span>
                            <span className="text-xs text-gray-400">{despesa.purchaseDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">{formatBRL(despesa.purchaseValue)}</span>
                            <button
                              onClick={() => {
                                setEditingExpense(despesa);
                                setFormData({
                                  purchaseName: despesa.purchaseName || "",
                                  purchaseValue: String(despesa.purchaseValue || ""),
                                  bankName: despesa.bankName || "",
                                  purchaseTypePayment: despesa.purchaseTypePayment || "",
                                  purchaseDate: despesa.purchaseDate
                                    ? despesa.purchaseDate.split("/").reverse().join("-")
                                    : new Date().toISOString().split("T")[0],
                                });
                                setErrorMsg("");
                                setIsModalOpen(true);
                              }}
                              className="text-gray-400 hover:text-primary-600 p-1 rounded hover:bg-primary-50"
                            >
                              <SquarePen size={14} />
                            </button>
                            <button
                              onClick={async () => {
                                await deletaDespesaExtra(despesa.id);
                                const novas = await buscaDespesasExtras();
                                setDespesas(novas);
                                router.refresh();
                              }}
                              className="text-gray-300 hover:text-red-500 p-1 rounded hover:bg-red-50"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>

                {despesas.length > LIMIT_GASTOS_MES && (
                  <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                    <button
                      onClick={() => setPageGastosMes((p) => Math.max(1, p - 1))}
                      disabled={pageGastosMes === 1}
                      className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30"
                    >
                      <ChevronLeft size={14} /> Anterior
                    </button>
                    <span className="text-xs text-gray-500">
                      {pageGastosMes} / {Math.ceil(despesas.length / LIMIT_GASTOS_MES)}
                    </span>
                    <button
                      onClick={() => setPageGastosMes((p) => Math.min(Math.ceil(despesas.length / LIMIT_GASTOS_MES), p + 1))}
                      disabled={pageGastosMes >= Math.ceil(despesas.length / LIMIT_GASTOS_MES)}
                      className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30"
                    >
                      Próximo <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>


            <div className="mb-5">
              <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">Gastos Fixos</h2>
                  </div>
                  <button
                    onClick={abrirModalCadastroFixa}
                    className="flex items-center gap-1.5 text-xs font-semibold text-white bg-primary-700 hover:bg-primary-600 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <CirclePlus size={14} /> Adicionar
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  {despesasFixas.length === 0 ? (
                    <div className="text-gray-400 text-sm text-center py-4">Nenhum gasto fixo cadastrado.</div>
                  ) : (
                    despesasFixas.slice((pageFixos - 1) * LIMIT_FIXOS, pageFixos * LIMIT_FIXOS).map((despesa) => (
                      <div key={despesa.id} className="flex items-center justify-between py-2">
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-gray-700">{despesa.name}</span>
                          <span className="text-xs text-gray-400">Vence todo dia {despesa.dayMaxPayment}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{formatBRL(despesa.value)}</span>
                          <button
                            onClick={() => abrirModalEdicaoFixa(despesa)}
                            className="text-gray-400 hover:text-primary-600 p-1 rounded hover:bg-primary-50"
                          >
                            <SquarePen size={14} />
                          </button>
                          <button
                            onClick={() => deletarDespesaFixaAsync(despesa.id)}
                            className="text-gray-300 hover:text-red-500 p-1 rounded hover:bg-red-50"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {despesasFixas.length > LIMIT_FIXOS && (
                  <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                    <button
                      onClick={() => setPageFixos((p) => Math.max(1, p - 1))}
                      disabled={pageFixos === 1}
                      className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30"
                    >
                      <ChevronLeft size={14} /> Anterior
                    </button>
                    <span className="text-xs text-gray-500">
                      {pageFixos} / {Math.ceil(despesasFixas.length / LIMIT_FIXOS)}
                    </span>
                    <button
                      onClick={() => setPageFixos((p) => Math.min(Math.ceil(despesasFixas.length / LIMIT_FIXOS), p + 1))}
                      disabled={pageFixos >= Math.ceil(despesasFixas.length / LIMIT_FIXOS)}
                      className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30"
                    >
                      Próximo <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>


            <div>
              <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">Compras Parceladas</h2>
                  </div>
                  <button
                    onClick={abrirModalCadastroParcelada}
                    className="flex items-center gap-1.5 text-xs font-semibold text-white bg-primary-700 hover:bg-primary-600 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <CirclePlus size={14} /> Adicionar
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  {comprasParceladas.length === 0 ? (
                    <div className="text-gray-400 text-sm text-center py-4">Nenhuma compra parcelada cadastrada.</div>
                  ) : (
                    comprasParceladas
                      .slice((pageParceladas - 1) * LIMIT_PARCELADAS, pageParceladas * LIMIT_PARCELADAS)
                      .map((compra) => {
                        const isOpen = openAccordion === compra.id;
                        const parcelasArray = compra.installments || [];

                        let total = 0;
                        parcelasArray.forEach((p: any) => {
                          total += parseFloat(p.installmentValue || 0);
                        });

                        return (
                          <div key={compra.id} className="rounded-xl border border-gray-200 overflow-hidden">
                            <div className="w-full flex items-center justify-between px-3.5 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors">
                              <button
                                onClick={() => setOpenAccordion(isOpen ? null : compra.id)}
                                className="flex-1 text-left flex items-center gap-2 min-w-0"
                              >
                                <span className="font-semibold text-gray-700 text-xs truncate">
                                  {compra.description || "Sem descrição"}
                                </span>
                                <ChevronDown
                                  size={14}
                                  className={`text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""
                                    }`}
                                />
                              </button>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs font-bold text-gray-900">{formatBRL(total)}</span>
                                <div className="flex gap-0.5">
                                  <button
                                    onClick={() => abrirModalEdicaoParcelada(compra)}
                                    className="text-gray-400 hover:text-primary-600 p-1 rounded hover:bg-primary-50"
                                  >
                                    <SquarePen size={14} />
                                  </button>
                                  <button
                                    onClick={() => deletarCompraParceladaAsync(compra.id)}
                                    className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {isOpen && (
                              <div className="border-t border-gray-200 bg-white">
                                <div className="divide-y divide-gray-100">
                                  {parcelasArray.map((parcela: any) => (
                                    <div
                                      key={parcela.id}
                                      className="flex items-center justify-between px-3.5 py-2 hover:bg-gray-50 transition-colors text-xs"
                                    >
                                      <span className="text-gray-500 font-medium">
                                        Parcela {parcela.installmentNumber} de {compra.quantityInstallments}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold text-gray-900">
                                          {formatBRL(parcela.installmentValue)}
                                        </span>
                                        <button
                                          onClick={() => deletarParcelaIndividualAsync(parcela.id)}
                                          className="text-gray-300 hover:text-red-500 p-0.5 rounded"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                  )}
                </div>

                {comprasParceladas.length > LIMIT_PARCELADAS && (
                  <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                    <button
                      onClick={() => setPageParceladas((p) => Math.max(1, p - 1))}
                      disabled={pageParceladas === 1}
                      className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30"
                    >
                      <ChevronLeft size={14} /> Anterior
                    </button>
                    <span className="text-xs text-gray-500">
                      {pageParceladas} / {Math.ceil(comprasParceladas.length / LIMIT_PARCELADAS)}
                    </span>
                    <button
                      onClick={() => setPageParceladas((p) => Math.min(Math.ceil(comprasParceladas.length / LIMIT_PARCELADAS), p + 1))}
                      disabled={pageParceladas >= Math.ceil(comprasParceladas.length / LIMIT_PARCELADAS)}
                      className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30"
                    >
                      Próximo <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>


        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4 w-full lg:w-[58%] order-1 lg:order-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Extrato Bancário Automático</h2>
              <p className="text-xs text-gray-500">Últimas transações importadas via Open Finance</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Buscar transação ou banco"
                value={searchTx}
                onChange={(e) => {
                  setSearchTx(e.target.value);
                  setPageTx(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm">
              Nenhuma transação bancária encontrada.
            </div>
          ) : (
            <div className="space-y-2">
              <div className="divide-y divide-gray-100">
                {filteredTransactions
                  .slice((pageTx - 1) * LIMIT_TX, pageTx * LIMIT_TX)
                  .map((tx) => {
                    const isPositive = tx.amount > 0 && tx.type !== 'DEBIT';
                    return (
                      <div key={tx.id} className="py-3 flex items-center justify-between gap-3 hover:bg-gray-50/50 px-2 rounded-lg transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isPositive ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                              }`}
                          >
                            {isPositive ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{tx.description}</p>
                            <div className="flex items-center gap-2 text-[11px] text-gray-400">
                              <span>{new Date(tx.date).toLocaleDateString('pt-BR')}</span>
                              <span>•</span>
                              <span className="font-medium text-gray-600">{tx.connectorName}</span>
                              {tx.category && (
                                <>
                                  <span>•</span>
                                  <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px]">
                                    {tx.category}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`text-sm font-bold shrink-0 ${isPositive ? "text-emerald-600" : "text-red-600"
                            }`}
                        >
                          {isPositive ? "+" : "-"} {formatBRL(Math.abs(tx.amount))}
                        </span>
                      </div>
                    );
                  })}
              </div>

              {filteredTransactions.length > LIMIT_TX && (
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => setPageTx((p) => Math.max(1, p - 1))}
                    disabled={pageTx === 1}
                    className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-2 py-1 rounded hover:bg-gray-100"
                  >
                    <ChevronLeft size={14} /> Anterior
                  </button>
                  <span className="text-xs text-gray-500">
                    {pageTx} / {Math.ceil(filteredTransactions.length / LIMIT_TX)}
                  </span>
                  <button
                    onClick={() => setPageTx((p) => Math.min(Math.ceil(filteredTransactions.length / LIMIT_TX), p + 1))}
                    disabled={pageTx >= Math.ceil(filteredTransactions.length / LIMIT_TX)}
                    className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-2 py-1 rounded hover:bg-gray-100"
                  >
                    Próximo <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
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

      <PluggyOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      <PluggyOnboardingModal
        isOpen={isConnectModalOpen}
        onClose={() => {
          setIsConnectModalOpen(false);
          handleSyncPluggy();
        }}
      />
    </div>
  );
}
