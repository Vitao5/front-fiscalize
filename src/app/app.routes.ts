
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./views/login/login.component').then(m => m.LoginComponent),
    title: 'Login'
  },
  {
    path:'404',
    loadComponent: () => import('./views/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent),
    title: '404'
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./views/create-count/create-count.component').then(m => m.CreateCountComponent),
    title: 'Criar Conta'
  },
  {
    path: 'home',
    loadComponent: () => import('./views/home/home.component').then(m => m.HomeComponent),
    title: 'Home',
  },
  {
    path: '**',
    redirectTo: '404'
  }
];
