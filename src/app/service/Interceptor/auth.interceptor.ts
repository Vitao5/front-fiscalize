import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpContextToken } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../localStorage.service';

export const BYPASS_AUTH = new HttpContextToken<boolean>(() => false);

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private localStorageService: LocalStorageService) {}

  // o intercetpor abaixo é para cada requisição, enviar o token de autenticação
  // essa funcinaldiade é para assegurar a autenticação e evitar que o usuário faça alterações sem estar logado
  // e por questões de segunrança

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.context.get(BYPASS_AUTH) === true) {
      // Se passado o paramentro não adiciona o token
      return next.handle(req);
    }

    // se não marcar que quer enviar o token na requisição
    // será considerado pra enviar o token
    const token = this.localStorageService.getStorage('token');

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
