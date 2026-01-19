import { Routes } from '@angular/router';
import { LayoutComponent } from './shareable/components/layout.component/layout.component';
import { DashboardComponent } from './dashboard.component/dashboard.component';
import { Login } from './auth/login/login';
import { Signup } from './auth/signup/signup';
import { ForgotPassword } from './auth/forgot-password/forgot-password';
import { LandingComponent } from './landing.component/landing.component';
import { FleetManagementComponent } from './fleet-management.component/fleet-management.component';
import { ShipmentTrackingComponent } from './shipment-tracking.component/shipment-tracking.component';
import { ComplianceComponent } from './compliance.component/compliance.component';
import { SettingsComponent } from './settings.component/settings.component';
import { RouteOptimization } from './route-optimization/route-optimization';
import { adminGuard } from './guards/admin-auth-guard';
import { AnalyticsReportsComponent } from './analytics-reports.component/analytics-reports.component';


export const routes: Routes = [
  {path:'',component:LandingComponent},
{path:'login', component:Login},
{path:'signup',component:Signup},
{path:'forgot-password',component:ForgotPassword},

{
    path: 'admin',
  component: LayoutComponent,
  canActivate:[adminGuard], // The parent layout
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'admin', redirectTo: 'dashboard', pathMatch: 'full' },
      {path: 'fleet', component:FleetManagementComponent},
      { path: 'admin', redirectTo: 'dashboard', pathMatch: 'full' },
      {path: 'shipment',component:ShipmentTrackingComponent},
      {path: 'compliance', component:ComplianceComponent},
      {path: 'settings', component:SettingsComponent},
      {path: 'routeopt',component:RouteOptimization},
      {path: 'analytics',component:AnalyticsReportsComponent},

    ]
  }
];
