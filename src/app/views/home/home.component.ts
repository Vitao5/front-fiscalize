import { Component, Inject, Input, NgModule, Output, EventEmitter, PLATFORM_ID, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { CookieService } from '../../service/cookie.service';
import { FinancasService, ExtraPurchase} from '../../service/financas.service';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { LocalStorageService } from '../../service/localStorage.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DespesaMes} from "../../components/cards/despesa-mes/despesa-mes";
import { ComunService } from '../../service/comun.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    ReactiveFormsModule,
    DespesaMes
],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  dataAtual = new Date().toLocaleDateString('pt-BR');
  nomeUsuario:string = ''
  despesasMes: string = ''
  isModalOpen: boolean = false
  isLoading: boolean = false

  extraPurchases: Array<ExtraPurchase> = [];

  constructor(
    private financasService: FinancasService,
    private localStorageService: LocalStorageService,
    private formBuilder: FormBuilder,
    private comunService: ComunService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
  }

  ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
     this.onDespesaAlterada(this.extraPurchases);
    }
  }

  ngAfterViewInit() {

  }



  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }


    get userName() {
    const user = this.localStorageService.getStorage('user');
    if (user && user.name) {
      return user.name.split(" ")[0];
    }
  }


  openModal() {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isModalOpen = false;
    document.body.style.overflow = 'auto';
  }

  onDespesaAlterada(novasDespesas: Array<ExtraPurchase>) {
    this.extraPurchases = novasDespesas;
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}
