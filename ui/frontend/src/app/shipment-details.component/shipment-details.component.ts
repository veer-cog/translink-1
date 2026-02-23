import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { GenericTableComponent, TableColumn } from '../shareable/components/generic-table.component/generic-table.component';
import { StatCardComponent } from '../shareable/components/stat-card.component/stat-card.component';

@Component({
  selector: 'app-shipment-details',
  standalone: true,
  imports: [CommonModule, RouterModule, GenericTableComponent, StatCardComponent],
  templateUrl: './shipment-details.component.html',
  styleUrl: './shipment-details.component.scss'
})
export class ShipmentDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  // Modal State Signals
  showStatusModal = signal(false);
  selectedStatus = signal('');

  rolePath = computed(() => 
    this.authService.currentUser()?.role?.toLowerCase() === 'admin' ? 'admin' : 'operator'
  );

  statusOptions = [
    { label: 'Booked', value: 'Booked' },
    { label: 'In Transit', value: 'Transit' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Cancelled', value: 'Cancelled' }
  ];

  shipment = signal<any>({
    id: 'SH-9921',
    customer: 'Acme Global Tech',
    priority: 'High',
    status: 'Transit',
    weight: 1250.5,
    revenue: 4500.00,
    fuelCost: 450.00,
    laborCost: 800.00,
    tollCost: 120.00,
    netProfit: 3130.00,
    vehicleId: 'TRK-101',
    driverName: 'John Smith',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  routeCols = signal<TableColumn[]>([
    { field: 'stopName', header: 'Location' },
    { field: 'type', header: 'Type' },
    { field: 'status', header: 'Status', type: 'badge' },
    { field: 'eta', header: 'ETA/Time' }
  ]);

  routeData = signal([
    { stopName: 'Warehouse A', type: 'Pickup', status: 'Done', eta: '08:00 AM' },
    { stopName: 'Port Newark', type: 'Transit', status: 'Transit', eta: '02:00 PM' },
    { stopName: 'Delivery Point B', type: 'Dropoff', status: 'Pending', eta: '06:30 PM' }
  ]);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
  }

  // Functional Methods
  openStatusModal() {
    this.selectedStatus.set(this.shipment().status);
    this.showStatusModal.set(true);
  }

  confirmStatusUpdate() {
    this.shipment.update(s => ({
      ...s,
      status: this.selectedStatus(),
      updatedAt: new Date()
    }));
    this.showStatusModal.set(false);
  }

  getStatusClass(status: string): string {
    return status?.toLowerCase().replace(/\s+/g, '-');
  }
}