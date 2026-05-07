import { Routes } from '@angular/router';
import { Login } from './features/login/pages/login';
import { Register } from './features/user/components/register/register';
import { AuthLayout } from './features/auth/layout/auth-layout';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: '',
        component: AuthLayout,
        children: [
            { path: 'login', component: Login },
            { path: 'register', component: Register },
        ],
    },
    { path: '**', redirectTo: 'login' },
];
