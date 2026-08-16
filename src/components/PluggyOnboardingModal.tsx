"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";

const PluggyConnect = dynamic(
  () => import("react-pluggy-connect").then((mod) => mod.PluggyConnect),
  { ssr: false }
);
import {
  Landmark,
  CheckCircle2,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Search,
  Building2,
  FlaskConical,
  RefreshCw,
  X
} from "lucide-react";
import {
  buscarConnectToken,
  salvarPluggyItem,
  buscarInstituicoesConectadas,
  deletarInstituicao,
  completarOnboarding,
  buscarConectores
} from "@/app/dashboard/pluggy-actions";
import { useRouter } from "next/navigation";

interface Connector {
  id: number;
  name: string;
  imageUrl?: string;
  primaryColor?: string;
  isSandbox?: boolean;
}

interface ConnectedItem {
  id: string;
  connectorName: string;
  connectorId: number;
  pluggyItemId: string;
  status: string;
}

interface Props {
  isOpen: boolean;
  onClose?: () => void;
}

export const PluggyOnboardingModal = ({ isOpen, onClose }: Props) => {
  const router = useRouter();
  const [connectToken, setConnectToken] = useState<string | null>(null);
  const [selectedConnectorId, setSelectedConnectorId] = useState<number | undefined>(undefined);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [connectedItems, setConnectedItems] = useState<ConnectedItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [loadingConnectors, setLoadingConnectors] = useState(true);
  const [connectingConnectorId, setConnectingConnectorId] = useState<number | null>(null);
  const [savingConnection, setSavingConnection] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen]);

  const loadInitialData = async () => {
    setLoadingConnectors(true);
    try {
      const [fetchedConnectors, fetchedItems] = await Promise.all([
        buscarConectores(),
        buscarInstituicoesConectadas()
      ]);
      setConnectors(fetchedConnectors);
      setConnectedItems(fetchedItems);
    } catch {
      setError("Erro ao carregar lista de instituições.");
    } finally {
      setLoadingConnectors(false);
    }
  };

  const loadConnectedItems = async () => {
    try {
      const items = await buscarInstituicoesConectadas();
      setConnectedItems(items);
    } catch {
      console.error("Erro ao carregar instituições conectadas");
    }
  };

  const handleSelectConnector = async (connector: Connector) => {
    setConnectingConnectorId(connector.id);
    setSelectedConnectorId(connector.id === 0 ? undefined : connector.id);
    setError("");
    try {
      const token = await buscarConnectToken();
      setConnectToken(token);
    } catch (err: any) {
      setError("Erro ao autenticar com o Pluggy. Tente novamente.");
      setConnectToken(null);
    } finally {
      setConnectingConnectorId(null);
    }
  };

  const handleSuccess = async (data: any) => {
    setSavingConnection(true);
    setError("");
    try {
      const itemData = data.item || data;
      await salvarPluggyItem(
        itemData.id,
        itemData.connector?.name || "Instituição",
        itemData.connector?.id || 0
      );
      await loadConnectedItems();
      setConnectToken(null);
      setSelectedConnectorId(undefined);
    } catch (err: any) {
      setError("Erro ao salvar a conexão no sistema.");
    } finally {
      setSavingConnection(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deletarInstituicao(id);
      await loadConnectedItems();
    } catch {
      setError("Erro ao remover conexão.");
    }
  };

  const handleDismiss = async () => {
    try {
      await completarOnboarding();
    } catch {}
    if (onClose) onClose();
    router.refresh();
  };

  const handleComplete = async () => {
    setCompleting(true);
    setError("");
    try {
      await completarOnboarding();
      if (onClose) {
        onClose();
      }
      router.refresh();
    } catch (err: any) {
      if (onClose) onClose();
      router.refresh();
    } finally {
      setCompleting(false);
    }
  };

  const filteredConnectors = useMemo(() => {
    if (!searchTerm.trim()) return connectors;
    const term = searchTerm.toLowerCase();
    return connectors.filter((c) => c.name.toLowerCase().includes(term));
  }, [connectors, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={handleDismiss} />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl animate-modal-in overflow-hidden my-auto flex flex-col max-h-[90vh]">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-gray-900 flex items-center justify-center transition-all shadow-sm border border-gray-200"
          title="Fechar"
        >
          <X size={18} />
        </button>

        <div
          className="px-6 py-6 sm:px-8 sm:py-7 shrink-0 text-center relative border-b border-green-100"
          style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)" }}
        >
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 shadow-md"
            style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}
          >
            <Landmark className="text-white" size={26} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Conecte suas Contas
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto mt-1">
            Escolha sua instituição financeira abaixo para conectar automaticamente via Open Finance regulado pelo Banco Central.
          </p>

          <div className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-green-200 rounded-full px-3 py-1 mt-3 shadow-sm">
            <ShieldCheck size={14} className="text-green-600" />
            <span className="text-[11px] font-semibold text-green-800">
              Conexão Segura e Criptografada (Pluggy Open Finance)
            </span>
          </div>
        </div>

        <div className="px-6 py-5 sm:px-8 space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="p-3.5 text-sm text-red-700 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          {connectedItems.length > 0 && (
            <div className="bg-green-50/60 border border-green-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-green-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-green-600" />
                  Instituições Conectadas ({connectedItems.length})
                </span>
                <span className="text-[11px] text-green-700 font-medium">Pronto para avançar</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {connectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-white border border-green-200 rounded-xl px-3.5 py-2.5 shadow-sm"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={15} className="text-green-600" />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 truncate">
                        {item.connectorName}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors shrink-0 ml-2"
                      title="Remover conexão"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                {connectedItems.length === 0 ? "Selecione uma instituição:" : "Adicionar outra instituição:"}
              </label>
              {connectors.length > 0 && (
                <span className="text-xs text-gray-400">
                  {filteredConnectors.length} disponíveis
                </span>
              )}
            </div>

            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Buscar banco ou instituição (ex: Nubank, Itaú, Inter)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              />
            </div>
          </div>

          {loadingConnectors ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-gray-400">
              <Loader2 size={28} className="animate-spin text-green-600" />
              <p className="text-xs font-medium">Carregando lista de bancos disponíveis...</p>
            </div>
          ) : filteredConnectors.length === 0 ? (
            <div className="py-8 text-center bg-gray-50 rounded-2xl border border-gray-200">
              <Building2 className="mx-auto text-gray-300 mb-2" size={32} />
              <p className="text-sm font-medium text-gray-700">Nenhuma instituição encontrada para "{searchTerm}"</p>
              <p className="text-xs text-gray-400 mt-0.5">Tente buscar por outro nome ou conecte pelo Sandbox</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 sm:max-h-72 overflow-y-auto pr-1">
              {filteredConnectors.map((connector) => {
                const isConnecting = connectingConnectorId === connector.id;
                const isSandbox = connector.isSandbox || connector.id === 0 || connector.name.toLowerCase().includes('sandbox');

                return (
                  <button
                    key={connector.id}
                    onClick={() => handleSelectConnector(connector)}
                    disabled={isConnecting || savingConnection}
                    className={`group relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 text-center ${
                      isSandbox
                        ? "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-300 hover:border-emerald-500 hover:shadow-md"
                        : "bg-white border-gray-200 hover:border-green-400 hover:bg-green-50/30 hover:shadow-sm"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isConnecting ? (
                      <Loader2 size={24} className="animate-spin text-green-600 my-2" />
                    ) : connector.imageUrl ? (
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center p-1.5 mb-1.5 bg-gray-50 border border-gray-100 group-hover:scale-105 transition-transform">
                        <img
                          src={connector.imageUrl}
                          alt={connector.name}
                          className="max-w-full max-h-full object-contain rounded-md"
                          onError={(e) => {
                            // Fallback se imagem quebrar
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>
                    ) : isSandbox ? (
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 bg-emerald-100 text-emerald-700 shadow-inner group-hover:scale-105 transition-transform">
                        <FlaskConical size={20} />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 bg-gray-100 text-gray-700 group-hover:scale-105 transition-transform">
                        <Building2 size={20} />
                      </div>
                    )}

                    <span className="text-xs font-semibold text-gray-800 line-clamp-1 group-hover:text-green-700">
                      {connector.name}
                    </span>

                    {isSandbox && (
                      <span className="mt-1 text-[10px] uppercase font-bold text-emerald-700 bg-emerald-200/60 px-1.5 py-0.5 rounded-md">
                        Testes / Demo
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-6 py-4 sm:px-8 border-t border-gray-100 bg-gray-50/80 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleDismiss}
            className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors order-2 sm:order-1"
          >
            Pular por enquanto
          </button>

          <button
            onClick={handleComplete}
            disabled={completing || savingConnection}
            className="w-full sm:w-auto py-3 px-6 rounded-2xl font-bold text-white text-sm transition-all hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 order-1 sm:order-2"
            style={{
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              boxShadow: "0 4px 20px rgba(34,197,94,0.35)"
            }}
          >
            {completing ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Concluindo...
              </>
            ) : savingConnection ? (
              <>
                <RefreshCw size={18} className="animate-spin" /> Salvando...
              </>
            ) : (
              <>
                {connectedItems.length > 0 ? "Concluir e Acessar Dashboard" : "Acessar Dashboard"}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>

      {connectToken && (
        <PluggyConnect
          connectToken={connectToken}
          selectedConnectorId={selectedConnectorId}
          includeSandbox={true}
          onSuccess={handleSuccess}
          onError={(error: any) => {
            console.error("Pluggy Connect Error:", error);
            setError("Houve uma falha na conexão com a instituição. Tente novamente.");
            setConnectToken(null);
            setSelectedConnectorId(undefined);
          }}
          onClose={() => {
            setConnectToken(null);
            setSelectedConnectorId(undefined);
          }}
        />
      )}
    </div>
  );
};
