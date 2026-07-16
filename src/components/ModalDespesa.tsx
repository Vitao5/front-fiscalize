"use client";

import React from "react";
import { Button, Label, TextInput, Select, Spinner } from "flowbite-react";
import { CirclePlus, DollarSign, Landmark, ShoppingCart, SquarePen, Calendar, FileText, CheckCircle2, X } from "lucide-react";
import { formatBRLInput } from "@/comum-functions";

interface FormData {
  purchaseName: string;
  purchaseValue: string;
  bankName: string;
  purchaseTypePayment: string;
  purchaseDate: string;
}

interface ModalDespesaProps {
  isOpen: boolean;
  onClose: () => void;
  editingExpense: any | null;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
  errorMsg: string;
  opcoesBancos: { value: string; label: string }[];
  opcoesPagamento: { value: string; label: string }[];
}

export const ModalDespesa = ({
  isOpen,
  onClose,
  editingExpense,
  formData,
  setFormData,
  onSubmit,
  saving,
  errorMsg,
  opcoesBancos,
  opcoesPagamento,
}: ModalDespesaProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md mx-4 p-6 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl animate-modal-in">
        <div className="space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              {editingExpense ? (
                <>
                  <SquarePen className="text-primary-400" size={20} /> Editar Despesa
                </>
              ) : (
                <>
                  <CirclePlus className="text-primary-400" size={20} /> Nova Despesa
                </>
              )}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
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
              <TextInput
                id="purchaseName"
                placeholder="Ex: Supermercado, Aluguel, Uber"
                value={formData.purchaseName}
                onChange={(e) => setFormData({ ...formData, purchaseName: e.target.value })}
                required
                className="[&_input]:bg-slate-900 [&_input]:border-slate-600 [&_input]:text-white [&_input]:placeholder-slate-500 [&_input]:focus:border-primary-500 [&_input]:focus:ring-primary-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="purchaseValue" className="font-semibold text-slate-300 text-sm flex items-center gap-1.5">
                  <DollarSign size={14} className="text-slate-400" /> Valor (R$) *
                </Label>
                <div className="flex rounded-lg border border-slate-600 bg-slate-900 focus-within:border-primary-500 overflow-hidden">
                  <span className="flex items-center px-3 text-sm font-semibold text-slate-400 bg-slate-800 border-r border-slate-600 select-none">R$</span>
                  <input
                    id="purchaseValue"
                    type="text"
                    placeholder="0,00"
                    value={formData.purchaseValue}
                    onChange={(e) => setFormData({ ...formData, purchaseValue: formatBRLInput(e.target.value) })}
                    required
                    className="w-full bg-transparent text-white placeholder-slate-500 px-3 py-2.5 text-sm outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="purchaseDate" className="font-semibold text-slate-300 text-sm flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-400" /> Data *
                </Label>
                <TextInput
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  required
                  className="[&_input]:bg-slate-900 [&_input]:border-slate-600 [&_input]:text-white [&_input]:focus:border-primary-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bankName" className="font-semibold text-slate-300 text-sm flex items-center gap-1.5">
                <Landmark size={14} className="text-slate-400" /> Categoria / Banco *
              </Label>
              <Select
                id="bankName"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                required
                className="[&_select]:bg-slate-900 [&_select]:border-slate-600 [&_select]:text-white [&_select]:focus:border-primary-500"
              >
                <option value="">Selecione...</option>
                {opcoesBancos.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="purchaseTypePayment" className="font-semibold text-slate-300 text-sm flex items-center gap-1.5">
                <ShoppingCart size={14} className="text-slate-400" /> Forma de Pagamento *
              </Label>
              <Select
                id="purchaseTypePayment"
                value={formData.purchaseTypePayment}
                onChange={(e) => setFormData({ ...formData, purchaseTypePayment: e.target.value })}
                required
                className="[&_select]:bg-slate-900 [&_select]:border-slate-600 [&_select]:text-white [&_select]:focus:border-primary-500"
              >
                <option value="">Selecione...</option>
                {opcoesPagamento.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Select>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-700">
              <Button
                type="button"
                color="gray"
                onClick={onClose}
                disabled={saving}
                className="font-medium bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-primary-700 hover:bg-primary-600 text-white font-bold px-4 border-0"
              >
                {saving ? (
                  <>
                    <Spinner size="sm" className="mr-2" /> Salvando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={15} className="mr-2" /> Salvar
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
