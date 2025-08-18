import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  setCookie(nameCookie: string, value: string, days: number) {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Não executar no servidor
    }
    
    if( !!nameCookie && !!value && days > 0) {
          //dia de duração do cookie até ele expirar
      const expires = new Date(Date.now() + days * 864e5).toUTCString();
      this.document.cookie = `${nameCookie}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
    }
  }

  getCookie(nameCookie: string): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null; // Retornar null no servidor
    }
    
    const cookies = this.document.cookie.split('; ');
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === nameCookie) {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  deleteCookie(nameCookie: string) {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Não executar no servidor
    }
    
    if (this.getCookie(nameCookie)) {
      this.document.cookie = `${nameCookie}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  }
}
