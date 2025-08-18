import { ComunService } from './../../../service/comun.service';
import { Component, Inject, Input, NgModule, Output, EventEmitter, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { ExtraPurchase, FinancasService } from '../../../service/financas.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
import { After } from 'v8';

@Component({
  selector: 'app-despesa-mes',
  templateUrl: './despesa-mes.html',
  styleUrls: ['./despesa-mes.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})

export class DespesaMes implements AfterViewInit {
  despesasMes: string = ''
  @Output() valorAlterado = new EventEmitter<Array<ExtraPurchase>>();

  isModalOpen: boolean = false;
  despesaForm: FormGroup;
  isLoading: boolean = false;
  extraPurchases: Array<ExtraPurchase> = [];

  constructor(
    private financasService: FinancasService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private comunService: ComunService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const dataDia = new Date();
    const dataFormatada = moment(dataDia).format('YYYY-MM-DD');

    this.despesaForm = this.formBuilder.group({
      purchaseName: ['', [Validators.required, Validators.minLength(2)]],
      purchaseValue: ['', [Validators.required, Validators.min(0.01)]],
      purchaseDate: [dataFormatada, Validators.required],
      purchaseTypePayment: ["", Validators.required],
      bankName: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.listaDespesasMes();
    }
  }


  openModal() {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden'
  }
  closeModal() {
    this.isModalOpen = false;
    document.body.style.overflow = 'auto';
    this.despesaForm.reset();
  }
  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  listaDespesasMes() {
    this.financasService.listExtraPurhchases().subscribe((response: any) => {
      if (response.listFormatted.length === 0) {
        this.despesasMes = 'R$ 0,00'
        return
      } else {
          this.extraPurchases = response.listFormatted
          this.despesasMes = this.comunService.formatarMoeda(response.valuePurchases)
          this.valorAlterado.emit(this.extraPurchases)
      }
    });
  }

  registrarDespesaExtra() {
    if (this.despesaForm.valid) {
      this.isLoading = true;
      const formData = this.despesaForm.value;
      const mesCompraDespesas = new Date(formData.purchaseDate).getMonth() + 1;

      const despesa = [

        {
          purchaseName: formData.purchaseName,
          purchaseTypePayment: formData.purchaseTypePayment,
          bankName: formData.bankName,
          purchaseValue: formData.purchaseValue,
          monthPayment: mesCompraDespesas,
          purchaseDate: formData.purchaseDate
        }
      ]


      try {
        this.financasService.registerExtraPurchase(despesa).subscribe((response: any) => {
          if(response.status === 200) {
            this.toastr.success('Despesa registrada com sucesso!', 'Sucesso');
              setTimeout(() => {
              this.listaDespesasMes()
          }, 500);
          }

        });

      } catch (error) {
        this.toastr.error('Erro ao registrar despesa', 'Erro');
      } finally {
        this.isLoading = false;
        this.closeModal();
      }
    }
  }
}

