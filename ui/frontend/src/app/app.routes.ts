import { Routes } from '@angular/router';
import { Landingpage } from './pages/landing-page/landing-page';
import { Login } from './auth/login/login';
import { Signup } from './auth/signup/signup';

export const routes: Routes = [
    {
        path: '',
        component: Landingpage,
    },
    {
        path: 'login',
        component: Login,
    },
    {
        path: 'signup',
        component: Signup,
    },
];
