import { Routes } from '@angular/router';
import { LayoutComponent } from './shareable/components/layout.component/layout.component';
import { DashboardComponent } from './dashboard.component/dashboard.component';
import { FleetManagement } from './fleet-management/fleet-management';
import { Login } from './auth/login/login';
import { Signup } from './auth/signup/signup';
import { ForgotPassword } from './auth/forgot-password/forgot-password';
import { LandingComponent } from './landing.component/landing.component';

export const routes: Routes = [
  {path:'',component:LandingComponent},
{path:'login', component:Login},
{path:'signup',component:Signup},
{path:'forgot-password',component:ForgotPassword},

{
    path: 'admin',
  component: LayoutComponent, // The parent layout
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'admin', redirectTo: 'dashboard', pathMatch: 'full' },
      {path: 'fleet', component:FleetManagement}
    ]
  }
];
