import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Added Router

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { PopoverModule } from 'primeng/popover';
import { BadgeModule } from 'primeng/badge';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, AvatarModule, TooltipModule, PopoverModule, BadgeModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  authService = inject(AuthService);
  isCollapsed = false;

  // Reactive Notification List
  notifications = signal([
    { id: 1, title: 'Maintenance Alert', desc: 'Vehicle TRK-102 due for service', time: '2m ago', type: 'warn', route: '/admin/fleet' },
    { id: 2, title: 'Route Update', desc: 'Driver assigned to Shipment #882', time: '15m ago', type: 'info', route: '/admin/tracking' },
    { id: 3, title: 'Compliance Issue', desc: 'Driver license expiring soon', time: '1h ago', type: 'error', route: '/admin/compliance' }
  ]);

  constructor(private router: Router) {}


  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  // Redirect to specific page and close popover
  navigateToIssue(notif: any, popover: any) {
    this.router.navigate([notif.route]);
    popover.hide(); 
    // Optional: Auto-remove notification once clicked
    // this.clearNotification(notif.id); 
  }

  // Remove single notification
  clearNotification(id: number, event: Event) {
    event.stopPropagation(); // Prevents triggering the parent click (navigation)
    this.notifications.update(prev => prev.filter(n => n.id !== id));
  }
  
  // Clear everything
  clearAll() {
    this.notifications.set([]);
  }
  menuItems = [
      { label: 'Dashboard', icon: 'pi pi-th-large', path: '/admin/dashboard' },
      { label: 'Fleet Management', icon: 'pi pi-car', path: '/admin/fleet' },
      { label: 'Shipment Tracking', icon: 'pi pi-box', path: '/admin/shipment' },
      { label: 'Route Optimization', icon: 'pi pi-map', path: '/admin/routeopt' },
      { label: 'Compliance', icon: 'pi pi-shield', path: '/admin/compliance' },
      { label: 'Analytics & Reports', icon: 'pi pi-chart-bar', path: '/admin/analytics' }
    ];

  onLogout(){
    this.authService.logout();
  }
}
