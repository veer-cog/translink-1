import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { TableColumn, GenericTableComponent } from '../shareable/components/generic-table.component/generic-table.component';
import { AlertListComponent } from "../shareable/components/alert-list.component/alert-list.component";
import { StatCardComponent } from "../shareable/components/stat-card.component/stat-card.component";
import { DashboardChartComponent } from "../shareable/components/dashboard-chart.component/dashboard-chart.component";
import { LayoutComponent } from "../shareable/components/layout.component/layout.component";
import { TabFilterComponent } from "../shareable/components/tab-filter.component/tab-filter.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // ... your imports (StatCardComponent, AlertListComponent, etc.)
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [AlertListComponent, StatCardComponent, DashboardChartComponent, GenericTableComponent, LayoutComponent, TabFilterComponent]
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  
  // 1. Data Signals
  shipmentData = signal<any[]>([]);
  totalElements = signal(0);

  // 2. Chart Signals (Initialized as null to handle loading states)
  shipmentChartData = signal<any>(null);
  
  // 3. Static Configurations
  shipmentCols: TableColumn[] = [
    { field: 'shipmentNumber', header: 'Shipment ID' },
    { field: 'clientName', header: 'Customer' },
    { field: 'status', header: 'Status', type: 'badge' },
    { field: 'routeId', header: 'Route' }
  ];

  
  
  // Computed Stats for the Cards
  totalActive = computed(() => this.shipmentData().filter(s => s.status === 'IN_TRANSIT').length);

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    // Fetch Table Data
    this.dashboardService.getShipments(0).subscribe(res => {
      this.shipmentData.set(res.content);
      this.totalElements.set(res.totalElements);
    });

    // Fetch Chart Data (Mapped from the Map<String, Object> backend response)
    this.dashboardService.getStats().subscribe(data => {
      this.shipmentChartData.set({
        labels: data.labels, // ['Jan', 'Feb', 'Mar'...]
        datasets: [
          { label: 'Created', data: data.created, borderColor: '#A5F951', tension: 0.4, fill: false },
          { label: 'In Transit', data: data.in_transit, borderColor: '#3b82f6', tension: 0.4, fill: false },
          { label: 'Delivered', data: data.delivered, borderColor: '#22c55e', tension: 0.4, fill: false },
          { label: 'Cancelled', data: data.cancelled, borderColor: '#ef4444', tension: 0.4, fill: false }
        ]
      });
    });
  }

  
}