import { Component, computed, inject, signal } from '@angular/core';
import { NavigationService } from '../services/navigation.service';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import {DrawerModule} from 'primeng/drawer';
@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, 
    DrawerModule,
    ButtonModule, 
    RippleModule, 
    AvatarModule,
    RouterModule,],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  navService = inject(NavigationService);
  authService = inject(AuthService);
  
  user = computed(() => this.authService.currentUser());
  currentRole = computed(() => this.user()?.role || 'CLIENT');

  menuItems = computed(() => {
    const role = this.currentRole();
    if (role === 'ADMIN') return this.adminItems;
    if (role === 'OPERATOR') return this.operatorItems;
    return this.clientItems;
  });

  openMenus = signal<Set<string>>(new Set());

  toggleMenu(label: string) {
    const set = new Set(this.openMenus());
    if (set.has(label)) {
      set.delete(label);
    } else {
      set.add(label);
    }
    this.openMenus.set(set);
  }

  isMenuOpen(label: string): boolean {
    return this.openMenus().has(label);
  }

  adminItems = [
    { label: 'Dashboard', icon: 'pi pi-chart-bar', routerLink: '/dashboard' },
    { 
      label: 'Fleet Management', icon: 'pi pi-truck', 
      children: [
        { label: 'Vehicle List', icon: 'pi pi-list', routerLink: '/admin/fleet/list' },
        { label: 'Register Vehicle', icon: 'pi pi-plus-circle', routerLink: '/admin/fleet/register' },
        { label: 'Maintenance Status', icon: 'pi pi-wrench', routerLink: '/admin/fleet/maintenance' }
      ]
    },
    { 
      label: 'Shipment Management', icon: 'pi pi-box',
      children: [
        { label: 'Shipment List', icon: 'pi pi-table', routerLink: '/admin/shipments/list' },
        { label: 'Assign Vehicle', icon: 'pi pi-link', routerLink: '/admin/shipments/assign' },
        { label: 'Reschedule Shipment', icon: 'pi pi-calendar-times', routerLink: '/admin/shipments/reschedule' }
      ]
    },
    { 
      label: 'Route Management', icon: 'pi pi-map',
      children: [
        { label: 'Route Plans', icon: 'pi pi-directions', routerLink: '/admin/routes/plans' },
        { label: 'Dispatch Planning', icon: 'pi pi-send', routerLink: '/admin/routes/dispatch' }
      ]
    },
    { 
      label: 'Compliance', icon: 'pi pi-verified',
      children: [
        { label: 'Compliance Logs', icon: 'pi pi-file', routerLink: '/admin/compliance/logs' },
        { label: 'Audit Reports', icon: 'pi pi-shield', routerLink: '/admin/compliance/audit' }
      ]
    },
    { 
      label: 'Analytics & Reports', icon: 'pi pi-percentage',
      children: [
        { label: 'Delivery Performance', icon: 'pi pi-bolt', routerLink: '/admin/analytics/delivery' },
        { label: 'Cost Efficiency', icon: 'pi pi-dollar', routerLink: '/admin/analytics/costs' }
      ]
    }
  ];

  operatorItems = [
    { label: 'Dashboard', icon: 'pi pi-chart-bar', routerLink: '/dashboard' },
    { 
      label: 'Fleet', icon: 'pi pi-truck',
      children: [
        { label: 'Vehicle List', icon: 'pi pi-list', routerLink: '/operator/fleet/list' },
        { label: 'Vehicle Status', icon: 'pi pi-info-circle', routerLink: '/operator/fleet/status' }
      ]
    },
    { 
      label: 'Shipments', icon: 'pi pi-box',
      children: [
        { label: 'Assigned Shipments', icon: 'pi pi-send', routerLink: '/operator/shipments/assigned' },
        { label: 'Update Delivery Status', icon: 'pi pi-refresh', routerLink: '/operator/shipments/update' }
      ]
    },
    { 
      label: 'Routes', icon: 'pi pi-map-marker',
      children: [
        { label: 'Route Plans', icon: 'pi pi-map', routerLink: '/operator/routes/plans' },
        { label: 'ETA Updates', icon: 'pi pi-clock', routerLink: '/operator/routes/eta' }
      ]
    },
    { label: 'Profile', icon: 'pi pi-user', routerLink: '/operator/profile' }
  ];

  clientItems = [
    { label: 'Dashboard', icon: 'pi pi-chart-bar', routerLink: '/client/dashboard' },
    { 
      label: 'Shipments', icon: 'pi pi-box',
      children: [
        { label: 'Shipment List', icon: 'pi pi-list', routerLink: '/client/shipments/list' },
        { label: 'Track Shipment', icon: 'pi pi-search', routerLink: '/client/shipments/track' },
        { label: 'Delivery Status', icon: 'pi pi-check-circle', routerLink: '/client/shipments/status' }
      ]
    },
    { label: 'Profile', icon: 'pi pi-user', routerLink: '/client/profile' }
  ];
}
