import { Routes } from '@angular/router';
import { LandingPage } from './pages/landing-page/landing-page';
import { Login } from './auth/login/login';
import { Signup } from './auth/signup/signup';
import { ForgotPassword } from './auth/forgot-password/forgot-password';

export const routes: Routes = [
    {
        path: '',
        component: LandingPage,
    },
    {
        path: 'login',
        component: Login,
    },
    {
        path: 'signup',
        component: Signup,
    },
    {
        path: 'forgot-password',
        component: ForgotPassword,
    },
];
