import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from '../../service/cookie.service';
import { LocalStorageService } from '../../service/localStorage.service';

import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit{
  erroLogin: string = '';
  formLogin: FormGroup = new FormGroup({});
  manterLogin: boolean = false;
  carregando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cookieService: CookieService,
    private localStorage: LocalStorageService,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.inicializaForm()
  }

inicializaForm(){
  this.manterLogin = this.localStorage.getStorage('manterLogin') || false;
   this.formLogin = this.fb.group({
        email: ['', [Validators.required, Validators.email, Validators.maxLength(24)]],
        senha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(24)]],
        manterLogin: [this.manterLogin]
      });
}

  salvaLogin() {
    this.manterLogin = this.formLogin.value.manterLogin;
    if (!!this.manterLogin) {
      this.localStorage.setItem('manterLogin', true);
    } else {
      this.localStorage.removeStorage('manterLogin');
    }
  }
  fazerLogin(){
    if (this.formLogin.invalid) {
      return;
    }

    this.erroLogin = '';

    const body = {
      email: this.formLogin.value.email,
      password: this.formLogin.value.senha
    };
    this.carregando = true;

    this.apiService.post('/users/login', body).subscribe({
      next: (response: any) => {
        this.carregando = false;
        if (response.token) {
          this.cookieService.setCookie('tokenLogin', response.token, 7);

          //monta objeto para salvar no localStorage
          const user = {
            name: response.name,
            email: response.email,
            userRoot: response.userRoot ? true : false,
          };
          this.localStorage.setItem('user', user);

          this.router.navigate(['/home']);
        } else {
          this.erroLogin = 'Erro ao fazer login. Tente novamente.';
        }
      },
      error: (error) => {
        this.carregando = false;
        if (error.status === 401) {
          this.erroLogin = 'Email ou senha inválidos.';
        } else {
          this.erroLogin = 'Erro ao fazer login. Tente novamente.';
        }
      }

    });
  }
}
