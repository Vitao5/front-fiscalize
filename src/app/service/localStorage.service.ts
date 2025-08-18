import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  setItem(key: string, value: any): void {
    if (isPlatformBrowser(this.platformId) && key) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  getStorage(key: string): any {
    if (isPlatformBrowser(this.platformId)) {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    }
    return null;
  }

  removeStorage(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }

  clearStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
  }
}

