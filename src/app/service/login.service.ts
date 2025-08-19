import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { catchError, Observable, throwError } from 'rxjs';
import { LoginInterface } from '../interface/login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private apiService: ApiService
  ) { }

  login(body: { email: string; password: string }): Observable<LoginInterface> {
    return this.apiService.post<LoginInterface>('/users/login', body).pipe(
      catchError(error => {
        console.error('Erro ao fazer login:', error);
        return throwError(() => error);
      })
    );
  }
}
