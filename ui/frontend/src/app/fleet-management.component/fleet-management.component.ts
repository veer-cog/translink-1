import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatCardComponent } from '../shareable/components/stat-card.component/stat-card.component';
import { GenericTableComponent, TableColumn } from '../shareable/components/generic-table.component/generic-table.component';
import { AddVehicleComponent } from '../shareable/components/add-vehicle.component/add-vehicle.component';
import { DetailsCardComponent } from '../shareable/components/details-card.component/details-card.component';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-fleet-management',
  standalone: true,
  imports: [
    CommonModule,
    AddVehicleComponent,
    StatCardComponent,
    GenericTableComponent,
    DetailsCardComponent
  ],
  templateUrl: './fleet-management.component.html',
  styleUrl: './fleet-management.component.scss',
})
export class FleetManagementComponent {
@ViewChild('addVehicleModal') addVehicleModal!: AddVehicleComponent;
  @ViewChild('detailsCard') detailsCard!: DetailsCardComponent;

  private router = inject(Router);
  private authService = inject(AuthService);
  searchQuery = signal<string>('');
  activeFilter = signal<string>('all');

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

  // The source of truth for your data
  fleetData = signal([
    { vehicleId: 'TRK-101', type: 'Heavy Truck', capacity: '20 tons', location: 'New York Hub', driver: 'John Smith', status: 'Active', nextMaintenance: '2026-03-15' },
    { vehicleId: 'TRK-045', type: 'Medium Truck', capacity: '10 tons', location: 'Chicago Hub', driver: 'Sarah Johnson', status: 'Maintenance', nextMaintenance: '2026-01-10' },
    { vehicleId: 'TRK-089', type: 'Light Van', capacity: '3 tons', location: 'Boston Hub', driver: 'Mike Davis', status: 'Active', nextMaintenance: '2026-02-10' }
  ]);

  constructor(private messageService: MessageService) {}

  /**
   * Logic to handle the data emitted from the AddVehicleComponent
   */
  handleVehicleSaved(vehicleData: any) {
    const currentData = this.fleetData();
    // We check if the vehicleId already exists to determine if this is an Edit or an Add
    const index = currentData.findIndex(v => v.vehicleId === vehicleData.vehicleId);

    if (index > -1) {
      // EDIT MODE: Update the existing record
      const updatedList = [...currentData];
      updatedList[index] = { ...vehicleData };
      this.fleetData.set(updatedList);
      
      this.messageService.add({ 
        severity: 'info', 
        summary: 'Updated', 
        detail: `Vehicle ${vehicleData.vehicleId} updated successfully.` 
      });
    } else {
      // ADD MODE: Add new vehicle to the top of the list
      this.fleetData.set([vehicleData, ...currentData]);
      
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Registered', 
        detail: 'New Vehicle added to fleet!' 
      });
    }
  }

  /**
   * Opens modal for Editing
   */
  editVehicle(vehicle: any) {
    // We pass the row data to the show() method of the child component
    this.addVehicleModal.show(vehicle);
  }

  /**
   * Deletes a vehicle from the signal array
   */
  deleteVehicle(vehicle: any) {
    if (confirm(`Are you sure you want to remove Vehicle ${vehicle.vehicleId}?`)) {
      this.fleetData.update(currentList => 
        currentList.filter(v => v.vehicleId !== vehicle.vehicleId)
      );
      this.messageService.add({ severity: 'warn', summary: 'Removed', detail: 'Vehicle deleted.' });
    }
  }

  // Reactive computed list for the table
  filteredFleet = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const filter = this.activeFilter().toLowerCase();

    return this.fleetData().filter(v => {
      const matchesSearch = v.vehicleId.toLowerCase().includes(query) || 
                            v.driver.toLowerCase().includes(query);
      const matchesStatus = filter === 'all' || v.status.toLowerCase() === filter;
      return matchesSearch && matchesStatus;
    });
  });

  // Reactive stats calculated from the fleetData signal
  stats = computed(() => [
    { label: 'Total Fleet', value: this.fleetData().length, icon: 'pi pi-car', color: '#2563eb' },
    { label: 'Active', value: this.fleetData().filter(v => v.status === 'Active').length, icon: 'pi pi-check-circle', color: '#22c55e' },
    { label: 'Maintenance', value: this.fleetData().filter(v => v.status === 'Maintenance').length, icon: 'pi pi-wrench', color: '#f59e0b' },
    { label: 'Inactive', value: this.fleetData().filter(v => v.status === 'Inactive').length, icon: 'pi pi-times-circle', color: '#ef4444' }
  ]);

  statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Maintenance', value: 'maintenance' },
    { label: 'Inactive', value: 'inactive' }
  ];

  onSearch(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  onStatusChange(event: Event) {
    this.activeFilter.set((event.target as HTMLSelectElement).value);
  }

  viewDetails(vehicle: any) {
    const role = this.authService.currentUser()?.role?.toLowerCase();
    
    // Navigate to the dynamic route: e.g., /admin/fleet/TRK-101
    this.router.navigate([`/${role}/fleet`, vehicle.vehicleId]);
  }
  }
