import { Component, computed, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatCardComponent } from '../shareable/components/stat-card.component/stat-card.component';
import { GenericTableComponent, TableColumn } from '../shareable/components/generic-table.component/generic-table.component';
import { AddVehicleComponent } from '../shareable/components/add-vehicle.component/add-vehicle.component';

@Component({
  selector: 'app-fleet-management',
  standalone: true,
  imports: [
    CommonModule,
    AddVehicleComponent,
    StatCardComponent,
    GenericTableComponent
  ],
  templateUrl: './fleet-management.component.html',
  styleUrl: './fleet-management.component.scss',
})
export class FleetManagementComponent {
  @ViewChild('addVehicleModal') addVehicleModal!: AddVehicleComponent;

  searchQuery = signal<string>('');
  activeFilter = signal<string>('all');

  cols: TableColumn[] = [
    { field: 'vehicleId', header: 'Vehicle ID' },
    { field: 'type', header: 'Type' },
    { field: 'capacity', header: 'Capacity' },
    { field: 'location', header: 'Location' },
    { field: 'driver', header: 'Driver' },
    { field: 'nextMaintenance', header: 'Next Maintenance' },
    { field: 'status', header: 'Status' },
    { field: 'actions', header: 'Actions' } 
  ];

  fleetData = signal([
    { vehicleId: 'TRK-101', type: 'Heavy Truck', capacity: '20 tons', location: 'New York Hub', driver: 'John Smith', status: 'Active', nextMaintenance: '2026-03-15' },
    { vehicleId: 'TRK-045', type: 'Medium Truck', capacity: '10 tons', location: 'Chicago Hub', driver: 'Sarah Johnson', status: 'Maintenance', nextMaintenance: '2026-01-10' },
    { vehicleId: 'TRK-089', type: 'Light Van', capacity: '3 tons', location: 'Boston Hub', driver: 'Mike Davis', status: 'Active', nextMaintenance: '2026-02-10' },
    { vehicleId: 'TRK-112', type: 'Heavy Truck', capacity: '20 tons', location: 'Philadelphia Hub', driver: 'Emily Brown', status: 'Active', nextMaintenance: '2026-03-28' },
    { vehicleId: 'TRK-156', type: 'Medium Truck', capacity: '12 tons', location: 'New York Hub', driver: 'Unassigned', status: 'Inactive', nextMaintenance: '2026-01-05' }
  ]);

  filteredFleet = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const filter = this.activeFilter().toLowerCase();

    return this.fleetData()
      .filter(v => {
        const matchesSearch = v.vehicleId.toLowerCase().includes(query);
        const matchesStatus = filter === 'all' || v.status.toLowerCase() === filter;
        return matchesSearch && matchesStatus;
      });
  });

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

  openAddVehicle() {
    this.addVehicleModal.show();
  }

  onVehicleAdded(newVehicle: any) {
    this.fleetData.update(data => [{ ...newVehicle, status: 'Active' }, ...data]);
  }

// Inside FleetManagementComponent class

// 1. Edit Logic: Opens the modal and populates it with existing data
editVehicle(vehicle: any) {
  if (this.addVehicleModal) {
    
    this.addVehicleModal.vehicleForm.patchValue({
      vehicleId: vehicle.vehicleId,
      type: vehicle.type,
      capacity: vehicle.capacity,
      location: vehicle.location,
      driver: vehicle.driver,
      nextMaintenance: vehicle.nextMaintenance
    });
    
    // Open the modal
    this.addVehicleModal.show();
  }
}

// 2. Delete Logic: Removes the vehicle from the data array
deleteVehicle(vehicle: any) {
  const idToDelete = vehicle.vehicleId;
  
  // Use a simple confirmation before deleting
  if (confirm(`Are you sure you want to remove Vehicle ${idToDelete}?`)) {
    this.fleetData.update(currentList => 
      currentList.filter(v => v.vehicleId !== idToDelete)
    );
  }
}
}