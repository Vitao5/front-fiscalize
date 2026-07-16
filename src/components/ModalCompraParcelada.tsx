"use client";

import React from "react";
import { Button, Label, TextInput, Spinner } from "flowbite-react";
import { CirclePlus, DollarSign, SquarePen, Calendar, FileText, CheckCircle2, X } from "lucide-react";
import { formatBRLInput } from "@/comum-functions";

interface FormParcelada {
  description: string;
  quantityInstallments: string;
  installmentValue: string;
}

interface ModalCompraParceladaProps {
  isOpen: boolean;
  onClose: () => void;
  editingParcelada: any | null;
  formParcelada: FormParcelada;
  setFormParcelada: React.Dispatch<React.SetStateAction<FormParcelada>>;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
  errorMsg: string;
}

export const ModalCompraParcelada = ({
  isOpen,
  onClose,
  editingParcelada,
  formParcelada,
  setFormParcelada,
  onSubmit,
  saving,
  errorMsg,
}: ModalCompraParceladaProps) => {
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
              {editingParcelada ? (
                <>
                  <SquarePen className="text-primary-400" size={20} /> Editar Compra Parcelada
                </>
              ) : (
                <>
                  <CirclePlus className="text-primary-400" size={20} /> Nova Compra Parcelada
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
              <Label htmlFor="description" className="font-semibold text-slate-300 text-sm flex items-center gap-1.5">
                <FileText size={14} className="text-slate-400" /> Descrição *
              </Label>
              <TextInput
                id="description"
              
                value={formParcelada.description}
                onChange={(e) => setFormParcelada({ ...formParcelada, description: e.target.value })}
                required
                className="[&_input]:bg-slate-900 [&_input]:h-10 [&_input]:px-3 [&_input]:border-slate-600 [&_input]:text-white [&_input]:placeholder-slate-500 [&_input]:focus:border-primary-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="quantityInstallments" className="font-semibold text-slate-300 text-sm flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-400" /> Qtd. Parcelas *
                </Label>
                <TextInput
                  id="quantityInstallments"
                  type="number"
                  min="1"
                  value={formParcelada.quantityInstallments}
                  onChange={(e) => setFormParcelada({ ...formParcelada, quantityInstallments: e.target.value })}
                  required
                  className="[&_input]:bg-slate-900 [&_input]:border-slate-600 [&_input]:h-10 [&_input]:px-3 [&_input]:text-white [&_input]:placeholder-slate-500 [&_input]:focus:border-primary-500"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="installmentValue" className="font-semibold text-slate-300 text-sm flex items-center gap-1.5">
                  <DollarSign size={14} className="text-slate-400" /> Valor da Parcela *
                </Label>
                <div className="flex rounded-lg border border-slate-600 bg-slate-900 focus-within:border-primary-500 overflow-hidden">
                  <span className="flex items-center px-3 text-sm font-semibold text-slate-400 bg-slate-800 border-r border-slate-600 select-none">R$</span>
                  <input
                    id="installmentValue"
                    type="text"
                    placeholder="0,00"
                    value={formParcelada.installmentValue}
                    onChange={(e) => setFormParcelada({ ...formParcelada, installmentValue: formatBRLInput(e.target.value) })}
                    required
                    className="w-full bg-transparent text-white placeholder-slate-500 px-3 py-2.5 text-sm outline-none"
                  />
                </div>
              </div>
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
