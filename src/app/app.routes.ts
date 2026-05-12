import { Routes } from '@angular/router';
import { Login } from './features/login/pages/login';
import { Register } from './features/user/components/register/register';
import { AuthLayout } from './features/auth/layout/auth-layout';
import { Homepage } from './features/post/page/homepage/homepage';
import { PostLayout } from './features/post/page/post-layout/post-layout';
import { PostDetails } from './features/post/page/post-details/post-details';

export const routes: Routes = [
    { path: '', redirectTo: 'post', pathMatch: 'full' },
    {
        path: 'post',
        component: PostLayout,
        children: [
            { path: '', component: Homepage },
            { path: ':id', component: PostDetails },
        ],
    },
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
