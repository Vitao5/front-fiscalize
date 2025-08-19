import { Component, Inject, Input, NgModule, Output, EventEmitter, PLATFORM_ID, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { CookieService } from '../../service/cookie.service';
import { FinancasService} from '../../service/extraPurchase.service';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { LocalStorageService } from '../../service/localStorage.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DespesaMes} from "../../components/cards/despesa-mes/despesa-mes";
import { ComunService } from '../../service/comun.service';
import { ToastrService } from 'ngx-toastr';
import { ExtraPurchase } from '../../interface/extra-puchase';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    ReactiveFormsModule,
    DespesaMes,
    DragDropModule
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
  dragPositions: { [key: string]: { x: number, y: number } } = {};


  constructor(
    private extraPurchase: FinancasService,
    private localStorageService: LocalStorageService,
    private formBuilder: FormBuilder,
    private comunService: ComunService,
    private toastr: ToastrService,
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
    this.extraPurchases.forEach(p => {
      if (!this.dragPositions[p.id]) {
        this.dragPositions[p.id] = { x: 0, y: 0 };
      }
    });
  }

  onDragEnded(purchase: ExtraPurchase, event: CdkDragEnd) {
    const distance = event.distance.x;
    const threshold = 80; // Distância em pixels para acionar a ação
    const element = event.source.element.nativeElement;

    // Se o item foi movido além do limite, mantenha-o aberto
    if (Math.abs(distance) > threshold) {
      // Trava na posição aberta (para a esquerda, mostrando o delete)
      if (distance < 0) {
        element.style.transform = 'translateX(-80px)'; // Ajuste este valor conforme a largura do seu botão
      } else {
        // Trava na posição aberta (para a direita, mostrando o editar)
        element.style.transform = 'translateX(80px)';
      }
      // Guarda a referência do elemento que está aberto
      // (Implementação futura: fechar este se outro for aberto)
    } else {
      // Se não atingiu o limite, volta para a posição original
      event.source.reset();
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  deletarGastoExtra(purchase: ExtraPurchase) {
    console.log(purchase);
    const body = {
      id: purchase.id
    }

    this.extraPurchase.deletePurchase(body).subscribe(response => {
      if (response) {
        this.extraPurchases = this.extraPurchases.filter(p => p.id !== purchase.id);
        this.toastr.success('Despesa deletada!', 'Sucesso');
      } else {
        this.toastr.error('Erro ao deletar gasto.', 'Erro');
      }
    })
  }

  atualizarGastoExtra(purchase: ExtraPurchase) {
    console.log(purchase);
    // const body = {
    //   id: purchase.id
    // }

    // this.extraPurchase.deletePurchase(body).subscribe(response => {
    //   if (response) {
    //     this.extraPurchases = this.extraPurchases.filter(p => p.id !== purchase.id);
    //     this.toastr.success('Despesa deletada!', 'Sucesso');
    //   } else {
    //     this.toastr.error('Erro ao deletar gasto.', 'Erro');
    //   }
    // })
  }
}
