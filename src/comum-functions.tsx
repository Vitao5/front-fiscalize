'use client';

import { jwtDecode } from "jwt-decode";

export default function getUserIdFromToken() {

  const tokenUser = localStorage.getItem("user")
  if (!tokenUser) throw new Error("Usuário não autenticado");
  const token = JSON.parse(tokenUser).token
  
  if (!token) throw new Error("Usuário não autenticado");
  
  const decoded = jwtDecode<any>(token);
  return decoded.id;
}

export function formatBRLInput(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  const numericValue = parseInt(digits, 10);
  const formatted = (numericValue / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatted;
}

export function parseBRLToFloat(value: string): number {
  const cleaned = value.replace(/\./g, "").replace(",", ".");
  return parseFloat(cleaned);
}
