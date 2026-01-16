import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, AvatarModule, InputTextModule, TooltipModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  authService = inject(AuthService);

  isCollapsed = false; // State for sidebar

menuItems = [
    { label: 'Dashboard', icon: 'pi pi-th-large', path: '/admin/dashboard' },
    { label: 'Fleet Management', icon: 'pi pi-car', path: '/admin/fleet' },
    { label: 'Shipment Tracking', icon: 'pi pi-box', path: '/admin/tracking' },
    { label: 'Route Optimization', icon: 'pi pi-map', path: '/admin/routeopt' },
    { label: 'Compliance', icon: 'pi pi-shield', path: '/admin/compliance' },
    { label: 'Analytics & Reports', icon: 'pi pi-chart-bar', path: '/admin/analytics' }
  ];
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  onLogout(){
    this.authService.logout();
  }
}
