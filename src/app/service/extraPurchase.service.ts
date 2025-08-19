import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LocalStorageService } from './localStorage.service';
import { ApiService } from './api.service';
import { ExtraPurchase } from '../interface/extra-puchase';


@Injectable({
  providedIn: 'root'
})
export class FinancasService {

  constructor(
    private apiService: ApiService
  ) { }

  //busca as compras extras que a pessoa registrou
  listExtraPurhchases(body?: any): Observable<ExtraPurchase[]> {
    return this.apiService.post('/extra-purchase/list', body,).pipe(
      map((response: any) => response as ExtraPurchase[]),
      catchError(error => {
        console.error('Erro ao buscar compras extras:', error);
        return of([]);
      })
    );
  }

  //registra as compras extras
  registerExtraPurchase(body: any): Observable<any> {
    return this.apiService.post('/extra-purchase/register', body).pipe(
      map((response: any) => response),
      catchError(error => {
        console.error('Erro ao registrar compra extra:', error);
        return of(null);
      })
    );
  }

  //deleta o gasto extra

  deletePurchase({ id }: { id: string }): Observable<any> {
    return this.apiService.post('/extra-purchase/delete', id).pipe(
      map((response: any) => response),
      catchError(error => {
        console.error('Erro ao deletar compra extra:', error);
        return of(null);
      })
    );

  }

  //altera as informações da compra extra
  updatePurchase(body: any): Observable<any> {
    return this.apiService.post('/extra-purchase/update', body).pipe(
      map((response: any) => response),
      catchError(error => {
        console.error('Erro ao atualizar compra extra:', error);
        return of(null);
      })
    );
  }
}
