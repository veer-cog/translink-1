import { Routes } from '@angular/router';
import { LayoutComponent } from './shareable/components/layout.component/layout.component';
import { DashboardComponent } from './dashboard.component/dashboard.component';
import { Login } from './auth/login/login';
import { Signup } from './auth/signup/signup';
import { ForgotPassword } from './auth/forgot-password/forgot-password';
import { LandingComponent } from './landing.component/landing.component';
import { FleetManagementComponent } from './fleet-management.component/fleet-management.component';
import { ShipmentTrackingComponent } from './shipment-tracking.component/shipment-tracking.component';
import { RouteOptimization } from './route-optimization/route-optimization';

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
      {path: 'fleet', component:FleetManagementComponent},
      { path: 'admin', redirectTo: 'dashboard', pathMatch: 'full' },
      {path: 'shipment',component:ShipmentTrackingComponent},
      {path: 'routeopt',component:RouteOptimization}
    ]
  }
];
