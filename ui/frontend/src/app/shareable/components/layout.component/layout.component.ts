import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { PopoverModule } from 'primeng/popover';
import { BadgeModule } from 'primeng/badge';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, AvatarModule, TooltipModule, PopoverModule, BadgeModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  authService = inject(AuthService);
  router = inject(Router);
  isCollapsed = false;

  // 1. Define the Master Menu List with Role requirements
// layout.component.ts

menuItems = computed(() => {
  const user = this.authService.currentUser();
  if (!user) return [];

  const role = user.role;
  // Determine prefix based on role
  const prefix = role === 'ADMIN' ? '/admin' : '/operator';

  const MASTER_MENU = [
    // Dashboards are usually unique
    { label: 'Dashboard', icon: 'pi pi-th-large', path: `${prefix}/dashboard`, roles: ['ADMIN', 'OPERATOR'] },
    
    // Shared Components - Path prefix changes based on who is logged in
    { label: 'Fleet Management', icon: 'pi pi-car', path: `${prefix}/fleet`, roles: ['ADMIN', 'OPERATOR'] },
    { label: 'Shipment Tracking', icon: 'pi pi-box', path: `${prefix}/shipment`, roles: ['ADMIN', 'OPERATOR'] },
    { label: 'Route Optimization', icon: 'pi pi-map', path: `${prefix}/routeopt`, roles: ['ADMIN', 'OPERATOR'] },
    
    // Admin Only
    { label: 'User Management', icon: 'pi pi-user', path: '/admin/users', roles: ['ADMIN'] },
    { label: 'Compliance', icon: 'pi pi-shield', path: '/admin/compliance', roles: ['ADMIN'] },
    { label: 'Analytics & Reports', icon: 'pi pi-chart-bar', path: '/admin/analytics', roles: ['ADMIN'] },
    { label: 'Activity Logs', icon: 'pi pi-file', path: '/admin/activity-logs', roles: ['ADMIN'] },
    
  ];

  return MASTER_MENU.filter(item => item.roles.includes(role!));
});

  notifications = signal([
    { id: 1, title: 'Maintenance Alert', desc: 'Vehicle TRK-102 due for service', time: '2m ago', type: 'warn', route: '/admin/fleet' },
    { id: 2, title: 'Route Update', desc: 'Driver assigned to Shipment #882', time: '15m ago', type: 'info', route: '/admin/tracking' },
    { id: 3, title: 'Compliance Issue', desc: 'Driver license expiring soon', time: '1h ago', type: 'error', route: '/admin/compliance' }
  ]);

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  navigateToIssue(notif: any, popover: any) {
    this.router.navigate([notif.route]);
    popover.hide(); 
  }

  clearNotification(id: number, event: Event) {
    event.stopPropagation();
    this.notifications.update(prev => prev.filter(n => n.id !== id));
  }
  
  clearAll() {
    this.notifications.set([]);
  }

  onLogout(){
    this.authService.logout();
  }
}