"use client";

import React from "react";
import { Button, Label, TextInput, Spinner } from "flowbite-react";
import { CirclePlus, DollarSign, SquarePen, Calendar, FileText, CheckCircle2, X } from "lucide-react";
import { formatBRLInput } from "@/comum-functions";

interface FormDespesaFixa {
  name: string;
  value: string;
  dayMaxPayment: string;
}

interface ModalDespesaFixaProps {
  isOpen: boolean;
  onClose: () => void;
  editingDespesaFixa: any | null;
  formDespesaFixa: FormDespesaFixa;
  setFormDespesaFixa: React.Dispatch<React.SetStateAction<FormDespesaFixa>>;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
  errorMsg: string;
}

export const ModalDespesaFixa = ({
  isOpen,
  onClose,
  editingDespesaFixa,
  formDespesaFixa,
  setFormDespesaFixa,
  onSubmit,
  saving,
  errorMsg,
}: ModalDespesaFixaProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md mx-4 p-6 bg-white rounded-xl border border-gray-200 shadow-2xl animate-modal-in">
        <div className="space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              {editingDespesaFixa ? (
                <>
                  <SquarePen className="text-primary-600" size={20} /> Editar Despesa Fixa
                </>
              ) : (
                <>
                  <CirclePlus className="text-primary-600" size={20} /> Nova Despesa Fixa
                </>
              )}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-900 transition-colors p-1 rounded-lg hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 text-sm text-red-600 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="fixedName" className="font-semibold text-gray-600 text-sm flex items-center gap-1.5">
                <FileText size={14} className="text-gray-400" /> Nome da despesa *
              </Label>
              <TextInput
                id="fixedName"
                value={formDespesaFixa.name}
                onChange={(e) => setFormDespesaFixa({ ...formDespesaFixa, name: e.target.value })}
                required
                className="[&_input]:bg-gray-50 [&_input]:h-10 [&_input]:px-3 [&_input]:border-gray-300 [&_input]:text-gray-900 [&_input]:placeholder-gray-400 [&_input]:focus:border-primary-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="fixedValue" className="font-semibold text-gray-600 text-sm flex items-center gap-1.5">
                  <DollarSign size={14} className="text-gray-400" /> Valor mensal *
                </Label>
                <div className="flex rounded-lg border border-gray-300 bg-gray-50 focus-within:border-primary-500 overflow-hidden">
                  <span className="flex items-center px-3 text-sm font-semibold text-gray-500 bg-gray-100 border-r border-gray-300 select-none">R$</span>
                  <input
                    id="fixedValue"
                    type="text"
                    placeholder="0,00"
                    value={formDespesaFixa.value}
                    onChange={(e) => setFormDespesaFixa({ ...formDespesaFixa, value: formatBRLInput(e.target.value) })}
                    required
                    className="w-full bg-transparent text-gray-900 placeholder-gray-400 px-3 py-2.5 text-sm outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dayMaxPayment" className="font-semibold text-gray-600 text-sm flex items-center gap-1.5">
                  <Calendar size={14} className="text-gray-400" /> Dia vencimento *
                </Label>
                <TextInput
                  id="dayMaxPayment"
                  type="number"
                  min="1"
                  max="31"
                  value={formDespesaFixa.dayMaxPayment}
                  onChange={(e) => setFormDespesaFixa({ ...formDespesaFixa, dayMaxPayment: e.target.value })}
                  required
                  className="[&_input]:bg-gray-50 [&_input]:border-gray-300 [&_input]:h-10 [&_input]:px-3 [&_input]:text-gray-900 [&_input]:placeholder-gray-400 [&_input]:focus:border-primary-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
              <Button
                type="button"
                color="gray"
                onClick={onClose}
                disabled={saving}
                className="font-medium bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
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
