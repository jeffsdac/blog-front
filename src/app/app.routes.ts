import { Routes } from '@angular/router';
import { Login } from './features/login/pages/login';
import { Register } from './features/user/components/register/register';

export const routes: Routes = [
    { path:'', component: Login },
    { path: 'register', component: Register }
];
