import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { AnalyticsService } from '../services/analytics-service'; // Import this
import { TableColumn, GenericTableComponent } from '../shareable/components/generic-table.component/generic-table.component';
import { AlertListComponent } from "../shareable/components/alert-list.component/alert-list.component";
import { StatCardComponent } from "../shareable/components/stat-card.component/stat-card.component";
import { DashboardChartComponent } from "../shareable/components/dashboard-chart.component/dashboard-chart.component";
import { LayoutComponent } from "../shareable/components/layout.component/layout.component";
import { TabFilterComponent } from "../shareable/components/tab-filter.component/tab-filter.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [AlertListComponent, StatCardComponent, DashboardChartComponent, GenericTableComponent, LayoutComponent, TabFilterComponent]
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private analyticsService = inject(AnalyticsService); // Inject AnalyticsService
  
  // 1. Data Signals
  shipmentData = signal<any[]>([]);
  totalElements = signal(0);
  
  // New Signal for Analytics Summary
  summaryData = signal<any>(null);

  // 2. Chart Signals
  shipmentChartData = signal<any>(null);
  
  // 3. Static Configurations
  shipmentCols: TableColumn[] = [
    { field: 'shipmentNumber', header: 'Shipment ID' },
    { field: 'clientName', header: 'Customer' },
    { field: 'status', header: 'Status', type: 'badge' },
    { field: 'routeId', header: 'Route' }
  ];

  // --- Computed Stats for the Cards ---
  
  // 1st Card: Total Shipments (from your existing Shipment Service)
  totalShipmentsCount = computed(() => this.totalElements());

  // 2nd Card: Active Now (Map from summary.totalDeliveries or similar)
  activeDeliveries = computed(() => this.summaryData()?.totalDeliveries || 0);

  // 3rd Card: Revenue (Map from summary.totalRevenue)
  totalRevenueValue = computed(() => {
    const rev = this.summaryData()?.totalRevenue || 0;
    return `$${(rev / 1000).toFixed(1)}k`; // Formats to $42.5k style
  });

  // 4th Card: Profit Margin / Health
  profitMargin = computed(() => {
    const margin = this.summaryData()?.profitMargin || 0;
    return `${margin}%`;
  });

  ngOnInit() {
    this.loadDashboard();
    this.loadAnalytics('month'); // Default period
  }

  loadDashboard() {
    this.dashboardService.getShipments(0).subscribe(res => {
      this.shipmentData.set(res.content);
      this.totalElements.set(res.totalElements);
    });

    this.dashboardService.getStats().subscribe(data => {
      this.shipmentChartData.set({
        labels: data.labels,
        datasets: [
          { label: 'Created', data: data.created, borderColor: '#A5F951', tension: 0.4, fill: false },
          { label: 'In Transit', data: data.in_transit, borderColor: '#3b82f6', tension: 0.4, fill: false },
          { label: 'Delivered', data: data.delivered, borderColor: '#22c55e', tension: 0.4, fill: false },
          { label: 'Cancelled', data: data.cancelled, borderColor: '#ef4444', tension: 0.4, fill: false }
        ]
      });
    });
  }

  // Load data from Analytics Service
  loadAnalytics(period: string) {
    this.analyticsService.getDashboardData(period).subscribe(res => {
      if (res.summary) {
        this.summaryData.set(res.summary);
      }
      // You can also map res.trends or res.operations here if needed
    });
  }
}