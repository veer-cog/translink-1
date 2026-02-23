import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GenericTableComponent, TableColumn } from '../shareable/components/generic-table.component/generic-table.component';
import { StatCardComponent } from '../shareable/components/stat-card.component/stat-card.component';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-vehicle-details',
  standalone: true,
  imports: [CommonModule, RouterModule, GenericTableComponent, StatCardComponent],
  templateUrl: './vehicle-details.component.html',
  styleUrl: './vehicle-details.component.scss'
})
export class VehicleDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
private authService = inject(AuthService);

  // 1. Dynamic Role Path for Navigation
  rolePath = computed(() => 
    this.authService.currentUser()?.role?.toLowerCase() === 'admin' ? 'admin' : 'operator'
  );
  // Core Vehicle Data (Based on your ER Diagram)
  vehicle = signal<any>({
    id: 'V-8829',
    numberPlate: 'TX-99-LR-4421',
    status: 'Active',
    type: 'Truck',
    driverName: 'John Doe',
    odometerReading: 45200.5,
    currentFuelLevel: 75,
    location: { lat: 34.05, lng: -118.24, speed: '55 mph' },
    updatedAt: new Date()
  });

  // Maintenance Logs Table Columns
  maintenanceCols = signal<TableColumn[]>([
    { field: 'serviceType', header: 'Service Type' },
    { field: 'mechanicName', header: 'Mechanic' },
    { field: 'cost', header: 'Cost' },
    { field: 'status', header: 'Status', type: 'badge' },
    { field: 'createdAt', header: 'Date' }
  ]);

  maintenanceData = signal([
    { serviceType: 'Oil Change', mechanicName: 'Mike Tech', cost: '$150', status: 'Done', createdAt: '2025-12-10' },
    { serviceType: 'Tire Rotation', mechanicName: 'Mike Tech', cost: '$80', status: 'Pending', createdAt: '2026-01-05' }
  ]);

  shipmentCols = signal<TableColumn[]>([
    { field: 'id', header: 'ID' },
    { field: 'customer', header: 'Customer' },
    { field: 'priority', header: 'Priority', type: 'badge' },
    { field: 'status', header: 'Status', type: 'badge' }
]);

shipmentData = signal([
    { id: 'SH-102', customer: 'Amazon', priority: 'High', status: 'In Transit' },
    { id: 'SH-105', customer: 'Walmart', priority: 'Low', status: 'Delivered' }
]);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    // Fetch logic would go here
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(/\s+/g, '-');
  }
}