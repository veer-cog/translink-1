import { Component, computed, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  @ViewChild('bookShipmentModal') bookShipmentModal!: BookShipmenComponent;
  @ViewChild('detailsCard') detailsCard!: DetailsCardComponent;

  searchQuery = signal<string>('');
  activeFilter = signal<string>('all');
  currentView = signal<'list' | 'map'>('list');
view: any;

  onShipmentAdded(newShipment: any) {
    const formattedShipment = {
      ...newShipment,
      shipmentId: `SH-${Math.floor(1000 + Math.random() * 9000)}`, // Generate ID
      customer: newShipment.customerName, // Map form field to table field
      status: 'Booked',
      route: `${newShipment.pickup} → ${newShipment.delivery}`,
      eta: 'TBD'
    };
    this.shipmentData.update(data => [formattedShipment, ...data]);
  }

  cols: TableColumn[] = [
  { field: 'shipmentId', header: 'Shipment ID', type: 'text' },
  { field: 'customer', header: 'Customer' },
  { field: 'route', header: 'Route', type: 'text' }, // We'll handle the icon in CSS
  { field: 'vehicle', header: 'Vehicle', type: 'text' },
  { field: 'status', header: 'Status', type: 'badge' },
  { field: 'priority', header: 'Priority', type: 'priority' },
  { field: 'eta', header: 'ETA', type: 'text' },
  { field: 'actions', header: 'Actions', type: 'action' }
];
  shipmentData = signal([
    { shipmentId: 'SH-2401', customer: 'Acme Corp', customerId: 'CUST-001', route: 'New York, NY → Boston, MA', vehicle: 'TRK-101', status: 'In Transit', priority: 'High', eta: '2026-01-06 14:00' },
    { shipmentId: 'SH-2402', customer: 'Global Logistics', customerId: 'CUST-002', route: 'Chicago, IL → Detroit, MI', vehicle: 'TRK-045', status: 'Delivered', priority: 'Medium', eta: '2026-01-05 10:00' },
    { shipmentId: 'SH-2403', customer: 'FastShip Inc', customerId: 'CUST-003', route: 'Philadelphia, PA → Baltimore, MD', vehicle: 'TRK-089', status: 'Booked', priority: 'Low', eta: '2026-01-06 18:00' },
    { shipmentId: 'SH-2404', customer: 'QuickMove Ltd', customerId: 'CUST-004', route: 'Boston, MA → New York, NY', vehicle: 'TRK-112', status: 'In Transit', priority: 'High', eta: '2026-01-06 16:00' }
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

  stats = computed(() => [
    { label: 'Total Shipments', value: '1,342', icon: 'pi pi-box', color: '#64748b' },
    { label: 'Booked', value: '156', icon: 'pi pi-calendar', color: '#a855f7' },
    { label: 'In Transit', value: '842', icon: 'pi pi-sync', color: '#3b82f6' },
    { label: 'Delivered', value: '344', icon: 'pi pi-check-circle', color: '#22c55e' }
  ]);

  statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Booked', value: 'booked' },
    { label: 'In Transit', value: 'in-transit' },
    { label: 'Delivered', value: 'delivered' }
  ];

  setView(view: 'list' | 'map') { this.currentView.set(view); }
  onSearch(e: Event) { this.searchQuery.set((e.target as HTMLInputElement).value); }
  onStatusChange(e: Event) { this.activeFilter.set((e.target as HTMLSelectElement).value); }

  viewDetails(shipment: any) {
    if (this.detailsCard) {
      this.detailsCard.show(shipment);
    }
  }
}