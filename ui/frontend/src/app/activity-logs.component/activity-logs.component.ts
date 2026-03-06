import { Component, signal, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select'; 
import { FormsModule } from '@angular/forms';
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

  // Signals for Table State
  logs = signal<AuditLog[]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(false);
  
  // Signals for Filters
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

  // Triggered by search input
  onSearchChange(value: string) {
    this.searchValue.set(value);
    this.dt?.reset(); // Jumping back to page 0 triggers loadLogs automatically
  }

  // Triggered by dropdown
  onServiceChange(value: string | null) {
    this.selectedService.set(value);
    this.dt?.reset();
  }

loadLogs(event: TableLazyLoadEvent) {
  this.loading.set(true);

  const page = (event.first || 0) / (event.rows || 10);
  const size = event.rows || 10;
  let sort = 'createdAt,desc';

  if (event.sortField) {
    const dir = event.sortOrder === 1 ? 'asc' : 'desc';
    sort = `${event.sortField},${dir}`;
  }

  this.auditService.getLogs(
    page, 
    size, 
    sort, 
    this.searchValue(), 
    this.selectedService() ?? undefined
  ).subscribe({
    next: (response: any) => {
      // 1. Logs are in 'content'
      this.logs.set(response.content || []);

      // 2. totalElements is at the ROOT of your JSON
      // We use the nullish coalescing operator just in case
      const total = response.totalElements ?? 0;
      this.totalRecords.set(total);

      this.loading.set(false);
    },
    error: (err) => {
      console.error("API Error:", err);
      this.loading.set(false);
    }
  });
}
  getServiceDetails(rawName: string) {
    const name = rawName?.toLowerCase() || '';
    if (name.includes('vehicle')) return { label: 'Vehicle', icon: 'pi-truck', color: '#3b82f6' };
    if (name.includes('route')) return { label: 'Route', icon: 'pi-map', color: '#10b981' };
    if (name.includes('shipment')) return { label: 'Shipment', icon: 'pi-box', color: '#f59e0b' };
    if (name.includes('auth')) return { label: 'Auth', icon: 'pi-shield', color: '#6366f1' };
    if (name.includes('audit')) return { label: 'Audit', icon: 'pi-history', color: '#64748b' };
    if (name.includes('analytics')) return { label: 'Analytics', icon: 'pi-chart-bar', color: '#ec4899' };
    return { label: 'System', icon: 'pi-cog', color: '#94a3b8' };
  }

  getSeverityTag(code: number): string {
    if (code >= 200 && code < 300) return 'success';
    if (code >= 400 && code < 500) return 'warning';
    return 'danger';
  }
}