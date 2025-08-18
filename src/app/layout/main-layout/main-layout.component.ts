import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { CookieService } from '../../service/cookie.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  template: `
    <div class="flex h-screen bg-gray-50">
      <app-sidebar></app-sidebar>
      <div class="flex-1 lg:ml-64 overflow-auto">
        <div class="p-6 pt-16 lg:pt-6">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class MainLayoutComponent implements OnInit {

  constructor(
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit() {
    // Verificar se o usuário está autenticado apenas no browser
    if (typeof window !== 'undefined') {
      const token = this.cookieService.getCookie('tokenLogin');
      if (!token) {
        this.router.navigate(['']);
      }
    }
  }
}
