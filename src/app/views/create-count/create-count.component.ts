import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { NgxMaskDirective } from 'ngx-mask';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-create-count',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule, NgxMaskDirective],
  standalone: true,
  templateUrl: './create-count.component.html'
})
export class CreateCountComponent implements OnInit {
  erroCadastro: string = '';
  formCadastro: FormGroup = new FormGroup({});
  carregandoCadastro: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.inicializaForm()
  }
    inicializaForm(){
      this.formCadastro = this.fb.group({
            email: ['', [Validators.required, Validators.email, Validators.maxLength(24)]],
            senha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(24)]],
            confirmarSenha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(24)]],
            celular: ['', [Validators.required]],
            nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
      });
    }

  onSubmit() {
    if (this.formCadastro.invalid) {
      return;
    }

    this.erroCadastro = '';

    const body = {
      email: this.formCadastro.value.email,
      password: this.formCadastro.value.senha,
      phoneNumber: this.formCadastro.value.celular,
      name: this.formCadastro.value.nome
    };

    if (this.formCadastro.value.senha !== this.formCadastro.value.confirmarSenha) {
      this.erroCadastro = 'As senhas não conferem.';
      return;
    }

    this.carregandoCadastro = true;

    this.apiService.post('/users/register', body).subscribe({
      next: () => {
        this.router.navigate(['']);
        this.carregandoCadastro = false;
      },
      error: (error) => {
        this.erroCadastro = error.error?.message || 'Erro ao criar conta.';
        this.carregandoCadastro = false;
      }
    });
  }
}
