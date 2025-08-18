import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComunService {

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }
}
