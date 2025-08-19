import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { catchError, map, Observable, of } from 'rxjs';
import { LoginInterface } from '../interface/login';



@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private apiService: ApiService
  ) { }

  login(body: Observable<LoginInterface[]>){
    return this.apiService.post('/users/login', body).pipe(
      map((response: any) => response),
      catchError(error => {
        console.error('Erro ao fazer login:', error);
        return of(null);
      })
    );
  }
}
