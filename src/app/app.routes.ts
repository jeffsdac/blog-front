import { Routes } from '@angular/router';
import { Login } from './features/login/pages/login';
import { Register } from './features/user/components/register/register';
import { AuthLayout } from './features/auth/layout/auth-layout';
import { Homepage } from './features/post/page/homepage/homepage';

export const routes: Routes = [
    { path: '', component: Homepage },
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
