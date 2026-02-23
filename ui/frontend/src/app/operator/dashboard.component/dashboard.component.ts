import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericTableComponent, TableColumn } from '../../shareable/components/generic-table.component/generic-table.component';
import { StatCardComponent } from "../../shareable/components/stat-card.component/stat-card.component";

@Component({
  selector: 'app-operator-dashboard',
  standalone: true,
  imports: [CommonModule, GenericTableComponent, StatCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  // Data Signal
  shipments = signal([
    { id: 'SH-2401', customer: 'Acme Corp', status: 'In Transit', vehicle: 'TRK-101', value: 1200 },
    { id: 'SH-2402', customer: 'Global Logistics', status: 'Delivered', vehicle: 'TRK-045', value: 3500 },
    { id: 'SH-2403', customer: 'Nexus Tech', status: 'Booked', vehicle: 'VAN-012', value: 800 },
    { id: 'SH-2404', customer: 'Prime Goods', status: 'In Transit', vehicle: 'TRK-088', value: 2100 }
  ]);

  searchTerm = signal('');

  // 2. Dynamic Stats Calculations
  totalVehicles = computed(() => new Set(this.shipments().map(s => s.vehicle)).size);
  activeCount = computed(() => this.shipments().filter(s => s.status === 'In Transit').length);
  
  // 3. Dynamic Filtering for the Table
  filteredShipments = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.shipments().filter(s => 
      s.id.toLowerCase().includes(term) || 
      s.customer.toLowerCase().includes(term)
    );
  });
  // Column Definitions
  columns = signal<TableColumn[]>([
    { field: 'id', header: 'Shipment ID' },
    { field: 'customer', header: 'Customer' },
    { field: 'status', header: 'Status', type: 'badge' },
    { field: 'vehicle', header: 'Vehicle' },
    { field: 'eta', header: 'ETA' }
  ]);

  // Stats Logic
  stats = computed(() => [
    { label: 'Total Shipments', value: this.shipments().length, icon: 'pi pi-box', color: '#6366f1' },
    { label: 'In Transit', value: this.shipments().filter(s => s.status === 'In Transit').length, icon: 'pi pi-truck', color: '#3b82f6' },
    { label: 'Deliveries Done', value: this.shipments().filter(s => s.status === 'Delivered').length, icon: 'pi pi-check-circle', color: '#22c55e' },
    { label: 'Pending Dispatch', value: 3, icon: 'pi pi-clock', color: '#f59e0b' }
  ]);

  viewDetails(shipment: any) {
    console.log('Viewing Details for:', shipment.id);
  }
}