import { Component, computed, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

// PrimeNG & Environment
import { MessageService } from 'primeng/api';
import { environment } from '../environments/environment';

// Services
import { AuthService } from '../auth/auth.service';
import { VehicleApi } from '../services/vehicle-api';
import { HubApiService } from '../services/hub-api.service';

// Components
import { StatCardComponent } from '../shareable/components/stat-card.component/stat-card.component';
import { GenericTableComponent, TableColumn } from '../shareable/components/generic-table.component/generic-table.component';
import { AddVehicleComponent } from '../shareable/components/add-vehicle.component/add-vehicle.component';
import { DetailsCardComponent } from '../shareable/components/details-card.component/details-card.component';
import { AddHubComponent } from '../shareable/components/add-hub.component/add-hub.component';

@Component({
  selector: 'app-fleet-management',
  standalone: true,
  imports: [
    CommonModule,
    AddVehicleComponent,
    StatCardComponent,
    GenericTableComponent,
    DetailsCardComponent,
    AddHubComponent
  ],
  templateUrl: './fleet-management.component.html',
  styleUrl: './fleet-management.component.scss',
})
export class FleetManagementComponent implements OnInit {

  @ViewChild('detailsCard') detailsCard!: DetailsCardComponent;
  @ViewChild('addHubModal') addHubModal!: AddHubComponent; 
  @ViewChild('addVehicleModal') addVehicleModal!: AddVehicleComponent;

  // Dependency Injection
  private router = inject(Router);
  private vehicleApi = inject(VehicleApi);
  private hubService = inject(HubApiService);
  private messageService = inject(MessageService);
  private http = inject(HttpClient);
  public authService = inject(AuthService); // FIXED: properly injected AuthService

  // Signals
  searchQuery = signal<string>('');
  activeFilter = signal<string>('all');
  fleetData = signal<any[]>([]);

  cols: TableColumn[] = [
    { field: 'vehicleId', header: 'Vehicle ID', type: 'text' },
    { field: 'type', header: 'Type' },
    { field: 'capacity', header: 'Capacity' },
    { field: 'location', header: 'Location' },
    { field: 'driver', header: 'Driver' },
    { field: 'nextMaintenance', header: 'Next Maintenance' },
    { field: 'status', header: 'Status', type: 'badge' },
    { field: 'actions', header: 'Actions', type: 'action' } 
  ];

  statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Maintenance', value: 'maintenance' },
    { label: 'Inactive', value: 'inactive' }
  ];

  ngOnInit() {
    this.loadVehicles();
  }

  loadVehicles() {
    this.vehicleApi.getVehicles().subscribe({
      next: (data) => this.fleetData.set(data),
      error: (err) => this.showError('Could not load fleet data')
    });
  }

  handleVehicleSaved(vehicleData: any) {
    console.log('Save Response:', vehicleData)
    this.vehicleApi.saveVehicle(vehicleData).subscribe({
       // Debug: Check this in your browser console
      next: (response) => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Vehicle database updated' 
        });
        this.loadVehicles(); 
      },
      error: (err) => this.showError('Failed to save vehicle')
    });
  }

  // In FleetManagementComponent
handleHubSaved(hubData: any) {
  const headers = new HttpHeaders({
    'X-Company-Id': this.authService.currentUser()?.companyId?.toString() || '',
    'X-User-Id': this.authService.currentUser()?.userId?.toString() || ''
  });

  this.http.post(`${environment.apiUrl}/hubs`, hubData, { headers }).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Hub added successfully' });
      this.loadVehicles(); 
    },
    error: (err) => {
      console.error('Hub Error:', err);
      this.showError('Failed to add Hub: ' + (err.error?.message || 'Check connection'));
    }
  });
}

  editVehicle(vehicle: any) {
    this.addVehicleModal.show(vehicle);
  }

  deleteVehicle(vehicle: any) {
    if (confirm(`Permanently delete ${vehicle.vehicleId}?`)) {
      this.vehicleApi.deleteVehicle(vehicle.id).subscribe({
        next: () => {
          this.fleetData.update(list => list.filter(v => v.id !== vehicle.id));
          this.messageService.add({ severity: 'info', summary: 'Deleted', detail: 'Vehicle removed' });
        },
        error: () => this.showError('Failed to delete vehicle')
      });
    }
  }

viewDetails(vehicle: any) {
    const role = this.authService.currentUser()?.role?.toLowerCase();
    
    // Navigate to the dynamic route: e.g., /admin/fleet/TRK-101
    this.router.navigate([`/${role}/fleet`, vehicle.vehicleId]);
  }

  private showError(msg: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }

  // Reactive Logic
  filteredFleet = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const filter = this.activeFilter().toLowerCase();

    return this.fleetData().filter(v => {
      const matchesSearch = v.vehicleId?.toLowerCase().includes(query) || 
                            v.driver?.toLowerCase().includes(query);
      const matchesStatus = filter === 'all' || v.status?.toLowerCase() === filter;
      return matchesSearch && matchesStatus;
    });
  });

  stats = computed(() => [
    { label: 'Total Fleet', value: this.fleetData().length, icon: 'pi pi-car', color: '#2563eb' },
    { label: 'Active', value: this.fleetData().filter(v => v.status === 'Active').length, icon: 'pi pi-check-circle', color: '#22c55e' },
    { label: 'Maintenance', value: this.fleetData().filter(v => v.status === 'Maintenance').length, icon: 'pi pi-wrench', color: '#f59e0b' },
    { label: 'Inactive', value: this.fleetData().filter(v => v.status === 'Inactive').length, icon: 'pi pi-times-circle', color: '#ef4444' }
  ]);

  onSearch(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  onStatusChange(event: Event) {
    this.activeFilter.set((event.target as HTMLSelectElement).value);
  }
}