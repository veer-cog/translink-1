import { Component, signal, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select'; 
import { AuditService, AuditLog } from '../services/audit.service';

@Component({
  selector: 'app-activity-logs',
  standalone: true,
  imports: [CommonModule, TableModule, DatePipe, InputTextModule, SelectModule, FormsModule],
  templateUrl: './activity-logs.component.html',
  styleUrl: './activity-logs.component.scss'
})
export class ActivityLogs {
  @ViewChild('dt') dt: Table | undefined;

  logs = signal<AuditLog[]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(false);
  
  searchValue = signal<string>('');
  selectedService = signal<string | null>(null);

  serviceOptions = [
    { label: 'All Services', value: null },
    { label: 'Vehicle', value: 'vehicle-service' },
    { label: 'Route', value: 'ROUTESERVICE' },
    { label: 'Shipment', value: 'ShipmentService' },
    { label: 'Auth', value: 'AuthServices' },
    { label: 'Audit', value: 'audit-service' },
    { label: 'Analytics', value: 'analytics-service' }
  ];

  constructor(private auditService: AuditService) {}

  onSearchChange(value: string) {
    this.searchValue.set(value);
    this.dt?.reset();
  }

  onServiceChange(value: string | null) {
    this.selectedService.set(value);
    this.dt?.reset();
  }

  loadLogs(event: TableLazyLoadEvent) {
    this.loading.set(true);
    const page = (event.first || 0) / (event.rows || 10);
    const size = event.rows || 10;
    let sort = event.sortField ? `${event.sortField},${event.sortOrder === 1 ? 'asc' : 'desc'}` : 'createdAt,desc';

    this.auditService.getLogs(page, size, sort, this.searchValue(), this.selectedService() ?? undefined)
      .subscribe({
        next: (response: any) => {
          this.logs.set(response.content || []);
          this.totalRecords.set(response.totalElements ?? 0);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  /**
   * Translates technical logs into Human Readable text
   */
  getFriendlyActivity(log: AuditLog): { action: string, target: string } {
    const endpoint = log.endpoint.toLowerCase();
    const method = log.method.toUpperCase();
    
    let action = 'Accessed';
    let target = 'System Resource';

    // Map Methods to Actions
    if (method === 'GET') action = 'Viewed';
    if (method === 'POST') action = 'Created';
    if (method === 'PUT' || method === 'PATCH') action = 'Updated';
    if (method === 'DELETE') action = 'Removed';

    // Map Endpoints to Targets
    if (endpoint.includes('/auth') || endpoint.includes('/login')) target = 'Security Settings';
    if (endpoint.includes('/vehicle')) target = 'Vehicle Fleet';
    if (endpoint.includes('/route')) target = 'Transport Route';
    if (endpoint.includes('/shipment')) target = 'Shipment Record';
    if (endpoint.includes('/company')) target = 'Company Profile';
    if (endpoint.includes('/audit')) target = 'Activity History';
    if (endpoint.includes('/user')) target = 'User Account';

    return { action, target };
  }

  getServiceDetails(rawName: string) {
    const name = rawName?.toLowerCase() || '';
    if (name.includes('vehicle')) return { label: 'Vehicle', icon: 'pi-truck', color: '#3b82f6' };
    if (name.includes('route')) return { label: 'Route', icon: 'pi-map', color: '#10b981' };
    if (name.includes('shipment')) return { label: 'Shipment', icon: 'pi-box', color: '#f59e0b' };
    if (name.includes('auth')) return { label: 'Auth', icon: 'pi-shield', color: '#6366f1' };
    if (name.includes('audit')) return { label: 'Audit', icon: 'pi-history', color: '#64748b' };
    return { label: 'System', icon: 'pi-cog', color: '#94a3b8' };
  }

  getSeverityTag(code: number): string {
    if (code >= 200 && code < 300) return 'success';
    if (code >= 400 && code < 500) return 'warning';
    return 'danger';
  }
}