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
import { ComplianceComponent } from './compliance.component/compliance.component';
import { SettingsComponent } from './settings.component/settings.component';
import { adminGuard } from './guards/admin-auth-guard';
import { AnalyticsReportsComponent } from './analytics-reports.component/analytics-reports.component';
import { UserManagementComponent } from './user-management.component/user-management.component';
import { DashboardComponent as OperatorDashboard } from './operator/dashboard.component/dashboard.component';
import { operatorGuard } from './guards/operator-auth-guard';
import { VehicleDetailsComponent } from './vehicle-details.component/vehicle-details.component';
import { ShipmentDetailsComponent } from './shipment-details.component/shipment-details.component';
import { RouteAnalysis } from './route-analysis.component/route-analysis.component';
import { ActivityLogs } from './activity-logs.component/activity-logs.component';
import { UserDetailsComponent } from './user-details.component/user-details.component';

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
      { path: 'fleet/:id', component: VehicleDetailsComponent }, // New Detail Route
      {path: 'shipment',component:ShipmentTrackingComponent},
      { path: 'shipment/:id', component: ShipmentDetailsComponent },
      {path: 'routeopt',component:RouteOptimization},
      {path: 'routes/analysis/:id',component:RouteAnalysis},
      {path: 'users',component:UserManagementComponent},
      { path: 'users/details/:userId',component:UserDetailsComponent },
      {path: 'activity-logs', component:ActivityLogs},
      {path: 'compliance', component:ComplianceComponent},
      {path: 'settings', component:SettingsComponent},
      {path: 'routeopt',component:RouteOptimization},
      {path: 'analytics',component:AnalyticsReportsComponent},

    ]
  },
  {
    path: 'operator',
    component: LayoutComponent,
    canActivate: [operatorGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: OperatorDashboard },
      { path: 'fleet', component: FleetManagementComponent },
      { path: 'shipment', component: ShipmentTrackingComponent },
      { path: 'routeopt', component: RouteOptimization },
      { path: 'settings', component: SettingsComponent },
      // Note: Compliance and User Management are excluded for Operators
    ]
  },
];
