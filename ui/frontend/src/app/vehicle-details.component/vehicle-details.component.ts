import { Component, signal, inject, OnInit, computed, ViewChild, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { GenericTableComponent, TableColumn } from '../shareable/components/generic-table.component/generic-table.component';
import { AuthService } from '../auth/auth.service';
import { VehicleApi } from '../services/vehicle-api';
import { LogMaintenanceComponent } from "../log-maintenance.component/log-maintenance.component";
import { MessageService } from 'primeng/api';
import { ToastModule } from "primeng/toast";

@Component({
  selector: 'app-vehicle-details',
  standalone: true,
  imports: [CommonModule, RouterModule, GenericTableComponent, LogMaintenanceComponent, ToastModule],
  templateUrl: './vehicle-details.component.html',
  styleUrl: './vehicle-details.component.scss',
  providers: [MessageService]
})
export class VehicleDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private vehicleApi = inject(VehicleApi);
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);
  private messageService = inject(MessageService);

  @ViewChild('maintenanceModal') maintenanceModal!: LogMaintenanceComponent;

  // --- Signals & State ---
  vehicle = signal<any>(null);
  maintenanceData = signal<any[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  // Dynamic Navigation Path based on User Role
  rolePath = computed(() => 
    this.authService.currentUser()?.role?.toLowerCase() === 'admin' ? 'admin' : 'operator'
  );

  maintenanceCols = signal<TableColumn[]>([
  { field: 'serviceType', header: 'Service Type' },
  { field: 'mechanicName', header: 'Mechanic' },
  { field: 'cost', header: 'Cost' },
  { field: 'status', header: 'Status', type: 'badge' }, 
  { field: 'timestamp', header: 'Date', type: 'date' },
  { field: 'description', header: 'Description' }
]);
  shipmentCols = signal<TableColumn[]>([
    { field: 'id', header: 'ID' },
    { field: 'customer', header: 'Customer' },
    { field: 'shipmentNumber', header: 'Shipment Number', type: 'badge' },
    { field: 'status', header: 'Status', type: 'badge' }
  ]);

  shipmentData = signal([]);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.loadData(id);
      } else {
        this.errorMessage.set("No Vehicle ID provided.");
        this.isLoading.set(false);
      }
    }
  }

  /**
   * Initial data fetch for the page
   */
/**
 * Initial data fetch for the page
 */
loadData(id: string) {
  this.isLoading.set(true);
  this.vehicleApi.getVehicleDetails(id).subscribe({
    next: (data) => {
      this.vehicle.set(data);
      
      // We use the numeric ID for shipments and plate/ID for logs
      if (data.id) {
        this.fetchVehicleShipments(data.id);
      }
      
      if (data.vehicleId) {
        this.fetchMaintenanceLogs(data.vehicleId);
      }
      
      this.isLoading.set(false);
    },
    error: (err) => {
      console.error("Error fetching vehicle details:", err);
      this.errorMessage.set("Failed to load vehicle details.");
      this.isLoading.set(false);
    }
  });
}

/**
 * New method to fetch and store shipment data
 */
private fetchVehicleShipments(vehicleId: number) {
  this.vehicleApi.getShipmentsByVehicle(vehicleId).subscribe({
    next: (shipments) => {
      // Mapping the data if necessary to match shipmentCols
      // For example, if 'clientName' from backend should show as 'customer' in table
      const formattedShipments = shipments.map((s: any) => ({
        ...s,
        customer: s.clientName,
      }));
      
      this.shipmentData.set(formattedShipments);
      console.log("Shipments loaded:", formattedShipments);
    },
    error: (err) => {
      console.error("Error fetching shipments for vehicle:", err);
      // Optional: set a separate error state for the shipments table
    }
  });
}

private fetchMaintenanceLogs(plate: string) {
    this.vehicleApi.getMaintenanceLogs(plate).subscribe({
      next: (logs) => {
        const sortedLogs = logs.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        this.maintenanceData.set(sortedLogs);
      },
      error: (err) => console.error("Error fetching logs:", err)
    });
  }

  getStatusClass(status: string): string {
    if (!status) return 'status-default';
    const s = status.toLowerCase();
    if (s.includes('active')) return 'status-active';
    if (s.includes('maintenance')) return 'status-warning';
    if (s.includes('out')) return 'status-danger';
    return 'status-default';
  }

  // --- Modal Controls ---

  showMaintenanceDialog(plate: string | undefined) {
    if (plate) {
      this.maintenanceModal.show(plate);
    }
  }

  editLog(log: any) {
    this.maintenanceModal.show(this.vehicle()?.vehicleId, log);
  }

  // --- Data Mutation (No Refresh Needed) ---

  handleRefresh(event: { action: 'added' | 'updated', data: any }) {
    const { action, data } = event;

    if (action === 'added') {
      // Optimistic update: Add to the beginning of the signal array
      this.maintenanceData.update(logs => [data, ...logs]);
    } else if (action === 'updated') {
      // Optimistic update: replace existing item in signal array
      this.maintenanceData.update(logs => 
        logs.map(log => log.id === data.id ? data : log)
      );
    }

    this.messageService.add({ 
      severity: 'success', 
      summary: 'Success', 
      detail: `Maintenance log ${action} successfully` 
    });
  }

  deleteLog(logId: number) {
  if (confirm('Are you sure you want to delete this maintenance entry?')) {
    this.vehicleApi.deleteMaintenanceLog(logId).subscribe({
      next: () => {
        // Instantly remove from UI using Signal update
        this.maintenanceData.update(logs => logs.filter(log => log.id !== logId));
        
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Deleted', 
          detail: 'Maintenance log removed successfully' 
        });
      },
      // FIX: Added explicit type to 'err' to resolve TS7006
      error: (err: HttpErrorResponse) => {
        console.error("Delete failed:", err);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Could not delete the log. Check permissions.' 
        });
      }
    });
  }
  }
}