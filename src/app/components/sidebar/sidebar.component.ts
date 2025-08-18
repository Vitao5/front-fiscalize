import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService } from '../../service/localStorage.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Overlay para mobile -->
    <div
      *ngIf="isOpen && isMobile"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      (click)="closeSidebar()">
    </div>

    <!-- Botão toggle para mobile (hambúrguer fixo no topo) -->
    <button
      *ngIf="isMobile"
      (click)="toggleSidebar()"
      class="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors lg:hidden">
      <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              [attr.d]="isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"></path>
      </svg>
    </button>

    <!-- Sidebar -->
    <div
      class="sidebar-container bg-white shadow-lg transition-all duration-300 z-50"
      [class]="sidebarClasses">

      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold">FF</span>
          </div>
          <span class="font-bold text-gray-800"
                [class.hidden]="!isOpen && !isMobile">Fiscalize Finanças</span>
        </div>

        <!-- Botão toggle para desktop -->
        <button
          *ngIf="!isMobile"

          (click)="toggleSidebar()"
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  [attr.d]="isOpen ? 'M11 19l-7-7 7-7m8 14l-7-7 7-7' : 'M9 5l7 7-7 7'"></path>
          </svg>
        </button>
      </div>

      <!-- Menu de navegação -->
      <nav class="mt-6 px-2">
        <ul class="space-y-2">
          <!-- Item Dashboard -->
          <li>
            <a
              routerLink="/home"
              routerLinkActive="bg-sky-50 text-sky-600"
              class="flex items-center p-3 text-gray-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg transition-colors"
              [class.justify-center]="!isOpen && !isMobile"
              (click)="onLinkClick()">
              <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <span class="ml-3 transition-opacity"
                    [class.hidden]="!isOpen && !isMobile">Dashboard</span>
            </a>
          </li>

          <!-- Item I.A -->
          <li>
            <a
              routerLink="/ia"
              routerLinkActive="bg-sky-50 text-sky-600"
              class="flex items-center p-3 text-gray-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg transition-colors"
              [class.justify-center]="!isOpen && !isMobile"
              (click)="onLinkClick()">
              <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <span class="ml-3 transition-opacity"
                    [class.hidden]="!isOpen && !isMobile">I.A</span>
            </a>
          </li>

          <!-- Item grupo -->
          <li>
            <a
              routerLink="/grupo"
              routerLinkActive="bg-sky-50 text-sky-600"
              class="flex items-center p-3 text-gray-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg transition-colors"
              [class.justify-center]="!isOpen && !isMobile"
              (click)="onLinkClick()">
              <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span class="ml-3 transition-opacity"
                    [class.hidden]="!isOpen && !isMobile">Grupo</span>
            </a>
          </li>

          <!-- Item Metas -->
          <li>
            <a
              routerLink="/metas"
              routerLinkActive="bg-sky-50 text-sky-600"
              class="flex items-center p-3 text-gray-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg transition-colors"
              [class.justify-center]="!isOpen && !isMobile"
              (click)="onLinkClick()">
              <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <span class="ml-3 transition-opacity"
                    [class.hidden]="!isOpen && !isMobile">Metas</span>
            </a>
          </li>

          <!-- Item Relatórios -->
          <li>
            <a
              routerLink="/relatorios"
              routerLinkActive="bg-sky-50 text-sky-600"
              class="flex items-center p-3 text-gray-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg transition-colors"
              [class.justify-center]="!isOpen && !isMobile"
              (click)="onLinkClick()">
              <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span class="ml-3 transition-opacity"
                    [class.hidden]="!isOpen && !isMobile">Relatórios</span>
            </a>
          </li>

          <!-- Item Configurações -->
          <li>
            <a
              routerLink="/configuracoes"
              routerLinkActive="bg-sky-50 text-sky-600"
              class="flex items-center p-3 text-gray-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg transition-colors"
              [class.justify-center]="!isOpen && !isMobile"
              (click)="onLinkClick()">
              <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span class="ml-3 transition-opacity"
                    [class.hidden]="!isOpen && !isMobile">Configurações</span>
            </a>
          </li>
        </ul>
      </nav>

      <!-- Perfil do usuário e logout -->
      <div class="mt-auto border-t pt-4 pb-4 px-4">
        <div class="flex items-center" [class.justify-center]="!isOpen && !isMobile">
          <div class="w-10 h-10 rounded-full bg-sky-200 flex items-center justify-center flex-shrink-0">
            <span class="text-gray-600 font-bold">{{ userInitials }}</span>
          </div>

          <div class="ml-3 flex-1" [class.hidden]="!isOpen && !isMobile">
            <p class="text-sm font-medium text-gray-700">{{ userName }}</p>
          </div>

          <button
            (click)="logout()"
            class="text-red-500 hover:text-red-700 flex-shrink-0 p-1"
            [class.ml-2]="isOpen || isMobile"
            [class.ml-0]="!isOpen && !isMobile">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar-container {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      display: flex;
      flex-direction: column;
      z-index: 50;
      width: 16rem; /* 64 em Tailwind (w-64) */
    }

    /* Desktop: sidebar sempre visível e pode colapsar */
    @media (min-width: 1024px) {
      .sidebar-container {
        position: relative;
        transform: none !important;
      }

      .sidebar-container.collapsed {
        width: 5rem; /* w-20 em Tailwind */
      }
    }

    /* Mobile: sidebar oculto por padrão */
    @media (max-width: 1023px) {
      .sidebar-container {
        transform: translateX(-100%);
        width: 16rem;
      }

      .sidebar-container.mobile-open {
        transform: translateX(0);
      }
    }
  `]
})
export class SidebarComponent implements OnInit, OnDestroy {
  isOpen: boolean = false;
  isMobile: boolean = false;
  private resizeListener?: () => void;

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkMobile();
      this.setupResizeListener();
    }
  }

  ngOnInit() {
    this.isOpen = this.localStorageService.getStorage('sidebarOpen') || false;
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  private checkMobile() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth < 1024;
    }
  }

  private setupResizeListener() {
    if (isPlatformBrowser(this.platformId)) {
      this.resizeListener = () => {
        const wasMobile = this.isMobile;
        this.checkMobile();

        // Se mudou de mobile para desktop
        if (wasMobile && !this.isMobile) {
          this.isOpen = true;
        }
        // Se mudou de desktop para mobile
        else if (!wasMobile && this.isMobile) {
          this.isOpen = false;
        }
      };

      window.addEventListener('resize', this.resizeListener);
    }
  }

  get sidebarClasses(): string {
    let classes = 'sidebar-container h-screen bg-white shadow-lg transition-all duration-300';

    if (this.isMobile) {
      classes += this.isOpen ? ' mobile-open' : '';
    } else {
      classes += this.isOpen ? '' : ' collapsed';
    }

    return classes;
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
    this.localStorageService.setItem('sidebarOpen', this.isOpen)
  }

  closeSidebar() {
    if (this.isMobile) {
      this.isOpen = false;
    }
  }

  onLinkClick() {
    if (this.isMobile) {
      this.closeSidebar();
    }
  }

  get userName(): string {
    const user = this.localStorageService.getStorage('user');
    if (user && user.name) {
      return user.name.split(" ")[0];
    }
    return 'Usuário';
  }

  get userInitials(): string {
    const user = this.localStorageService.getStorage('user');
    if (user && user.name) {
      const name = user.name.split(" ")[0];
      return name.charAt(0).toUpperCase();
    }
    return 'U';
  }

  logout() {
    this.localStorageService.removeStorage('user');
    this.router.navigate(['']);
  }
}
