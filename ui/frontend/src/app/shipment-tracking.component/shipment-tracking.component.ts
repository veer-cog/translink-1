import { Component, signal, ViewChild, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

// Services
import { ShipmentService } from '../services/shipment.service';
import { VehicleService } from '../services/vehicle.service';
import { RouteService } from '../services/route.service';
import { HubService } from '../services/hub.service';
import { AuthService } from '../auth/auth.service';

// Components
import { BookShipmenComponent } from "../shareable/components/book-shipmen.component/book-shipmen.component";
import { DetailsCardComponent } from "../shareable/components/details-card.component/details-card.component";
import { StatCardComponent } from "../shareable/components/stat-card.component/stat-card.component";
import { GenericTableComponent, TableColumn } from "../shareable/components/generic-table.component/generic-table.component";

@Component({
  selector: 'app-shipment-tracking',
  standalone: true,
  imports: [CommonModule, BookShipmenComponent, DetailsCardComponent, StatCardComponent, GenericTableComponent],
  templateUrl: './shipment-tracking.component.html',
  styleUrl: './shipment-tracking.component.scss'
})
export class ShipmentTrackingComponent implements OnInit {
  private shipmentService = inject(ShipmentService);
  private vehicleService = inject(VehicleService);
  private routeService = inject(RouteService);
  private hubService = inject(HubService);
  private authService = inject(AuthService);
  private router = inject(Router);

  @ViewChild('bookShipmentModal') bookShipmentModal!: any;

  // Raw Data Signals
  vehicles = signal<any[]>([]);
  routes = signal<any[]>([]);
  hubs = signal<any[]>([]);
  shipments = signal<any[]>([]);

  // Filter Signals
  searchQuery = signal<string>('');
  activeStatus = signal<string>('all');

  // 1. Table Column Definitions
  cols: TableColumn[] = [
    { field: 'shipmentNumber', header: 'Tracking ID' },
    { field: 'clientName', header: 'Customer' },
    { field: 'displayRoute', header: 'Route' },
    { field: 'vehiclePlate', header: 'Vehicle' },
    { field: 'status', header: 'Status', type: 'badge' },
    { field: 'totalWeight', header: 'Weight' },
    { field: 'actions', header: 'Actions', type: 'action' }
  ];

  // 2. Status Dropdown Options
  statusOptions = [
    { label: 'All Shipments', value: 'all' },
    { label: 'Booked', value: 'BOOKED' },
    { label: 'In Transit', value: 'IN_TRANSIT' },
    { label: 'Delivered', value: 'DELIVERED' }
  ];

  ngOnInit() {
    this.refreshAllData();
  }

  refreshAllData() {
    forkJoin({
      v: this.vehicleService.getVehicles(),
      r: this.routeService.getRoutes(),
      h: this.hubService.getHubs(),
      s: this.shipmentService.getAllShipments()
    }).subscribe({
      next: (res) => {
        this.vehicles.set(res.v);
        this.routes.set(res.r);
        this.hubs.set(res.h);
        this.shipments.set(res.s);
      },
      error: (err) => console.error("Could not load dashboard data", err)
    });
  }

  // 3. Computed: Join data to create readable Route and Vehicle strings
  enrichedShipments = computed(() => {
    return this.shipments().map(shipment => {
      const route = this.routes().find(r => r.id === shipment.routeId);
      const vehicle = this.vehicles().find(v => v.id === shipment.vehicleId);

      return {
        ...shipment,
        displayRoute: route ? route.stops : 'N/A',
        vehiclePlate: vehicle ? vehicle.numberPlate : `ID: ${shipment.vehicleId}`
      };
    });
  });

  // 4. Computed: Filtered Shipments based on search and status
  filteredShipments = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const status = this.activeStatus();

    return this.enrichedShipments().filter(s => {
      const matchesSearch = s.shipmentNumber?.toLowerCase().includes(query) || 
                            s.clientName?.toLowerCase().includes(query);
      const matchesStatus = status === 'all' || s.status === status;
      return matchesSearch && matchesStatus;
    });
  });

  // 5. Computed: Statistics Cards
  stats = computed(() => [
    { label: 'Total Shipments', value: this.shipments().length, icon: 'pi pi-box', color: '#64748b' },
    { label: 'In Transit', value: this.shipments().filter(s => s.status === 'IN_TRANSIT').length, icon: 'pi pi-sync', color: '#3b82f6' },
    { label: 'Delivered', value: this.shipments().filter(s => s.status === 'DELIVERED').length, icon: 'pi pi-check-circle', color: '#22c55e' }
  ]);

  // --- UI Event Handlers ---

  onSearch(event: any) {
    this.searchQuery.set(event.target.value);
  }

  onStatusChange(event: any) {
    this.activeStatus.set(event.target.value);
  }

  onShipmentAdded(payload: any) {
    this.shipmentService.createShipment(payload).subscribe(() => {
      this.refreshAllData();
      this.bookShipmentModal.hide();
    });
  }

  viewDetails(shipment: any) {
    const role = this.authService.currentUser()?.role?.toLowerCase() === 'admin' ? 'admin' : 'operator';
    this.router.navigate([`/${role}/shipment`, shipment.id]);
  }
}