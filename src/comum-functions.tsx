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
