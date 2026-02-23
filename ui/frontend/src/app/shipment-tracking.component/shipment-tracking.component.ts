import { Component, computed, signal, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Import Router
import { AuthService } from '../auth/auth.service'; // Import AuthService

import { StatCardComponent } from '../shareable/components/stat-card.component/stat-card.component';
import { GenericTableComponent, TableColumn } from '../shareable/components/generic-table.component/generic-table.component';
import { BookShipmenComponent } from '../shareable/components/book-shipmen.component/book-shipmen.component';
import { DetailsCardComponent } from '../shareable/components/details-card.component/details-card.component';
import { TabFilterComponent } from "../shareable/components/tab-filter.component/tab-filter.component";

@Component({
  selector: 'app-shipment-tracking',
  standalone: true,
  imports: [CommonModule, StatCardComponent, GenericTableComponent, BookShipmenComponent, DetailsCardComponent, TabFilterComponent],
  templateUrl: './shipment-tracking.component.html',
  styleUrl: './shipment-tracking.component.scss'
})
export class ShipmentTrackingComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  @ViewChild('bookShipmentModal') bookShipmentModal!: BookShipmenComponent;
  
  // Navigation Helper
  rolePath = computed(() => 
    this.authService.currentUser()?.role?.toLowerCase() === 'admin' ? 'admin' : 'operator'
  );

  searchQuery = signal<string>('');
  activeFilter = signal<string>('all');
  view = signal<string>('List'); // Use signal for consistency

  cols: TableColumn[] = [
    { field: 'shipmentId', header: 'Shipment ID' },
    { field: 'customer', header: 'Customer' },
    { field: 'route', header: 'Route' },
    { field: 'vehicle', header: 'Vehicle' },
    { field: 'status', header: 'Status', type: 'badge' },
    { field: 'priority', header: 'Priority' },
    { field: 'eta', header: 'ETA' },
    { field: 'actions', header: 'Actions', type: 'action' }
  ];

  shipmentData = signal([
    { shipmentId: 'SH-2401', customer: 'Acme Corp', customerId: 'CUST-001', route: 'New York, NY → Boston, MA', vehicle: 'TRK-101', status: 'In Transit', priority: 'High', eta: '2026-01-06 14:00' },
    { shipmentId: 'SH-2402', customer: 'Global Logistics', customerId: 'CUST-002', route: 'Chicago, IL → Detroit, MI', vehicle: 'TRK-045', status: 'Delivered', priority: 'Medium', eta: '2026-01-05 10:00' },
    { shipmentId: 'SH-2403', customer: 'FastShip Inc', customerId: 'CUST-003', route: 'Philadelphia, PA → Baltimore, MD', vehicle: 'TRK-089', status: 'Booked', priority: 'Low', eta: '2026-01-06 18:00' }
  ]);

  filteredShipments = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const filter = this.activeFilter().toLowerCase();
    return this.shipmentData().filter(s => {
      const matchesSearch = s.shipmentId.toLowerCase().includes(query) || s.customer.toLowerCase().includes(query);
      const matchesStatus = filter === 'all' || s.status.toLowerCase().replace(' ', '-') === filter;
      return matchesSearch && matchesStatus;
    });
  });

  // Dynamic Stats from real data
  stats = computed(() => [
    { label: 'Total Shipments', value: this.shipmentData().length, icon: 'pi pi-box', color: '#64748b' },
    { label: 'Booked', value: this.shipmentData().filter(s => s.status === 'Booked').length, icon: 'pi pi-calendar', color: '#a855f7' },
    { label: 'In Transit', value: this.shipmentData().filter(s => s.status === 'In Transit').length, icon: 'pi pi-sync', color: '#3b82f6' },
    { label: 'Delivered', value: this.shipmentData().filter(s => s.status === 'Delivered').length, icon: 'pi pi-check-circle', color: '#22c55e' }
  ]);

  statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Booked', value: 'booked' },
    { label: 'In Transit', value: 'in-transit' },
    { label: 'Delivered', value: 'delivered' }
  ];

  onSearch(e: Event) { this.searchQuery.set((e.target as HTMLInputElement).value); }
  onStatusChange(e: Event) { this.activeFilter.set((e.target as HTMLSelectElement).value); }

  // Redirect to the new Details Page
  viewDetails(shipment: any) {
    this.router.navigate([`/${this.rolePath()}/shipment`, shipment.shipmentId]);
  }

  onShipmentAdded(newShipment: any) {
    const formatted = { 
        ...newShipment, 
        shipmentId: `SH-${Math.floor(1000 + Math.random() * 9000)}`, 
        customer: newShipment.customerName, 
        status: 'Booked', 
        route: `${newShipment.pickup} → ${newShipment.delivery}`, 
        eta: 'TBD' 
    };
    this.shipmentData.update(data => [formatted, ...data]);
  }
}