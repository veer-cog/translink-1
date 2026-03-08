import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { GenericTableComponent, TableColumn } from '../../shareable/components/generic-table.component/generic-table.component';
import { StatCardComponent } from "../../shareable/components/stat-card.component/stat-card.component";
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-operator-dashboard',
  standalone: true,
  imports: [CommonModule, GenericTableComponent, StatCardComponent, ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  
  // Replace static data with signals
  shipments = signal<any[]>([]);
  chartData = signal<any>(null);
  chartOptions = signal<any>(null);
  
  // In a real app, get this from your Auth/User service

  ngOnInit() {
    this.loadDashboardData();
    this.initChartOptions();
  }

  loadDashboardData() {
    // Fetch Table Data (Page 0)
    this.dashboardService.getShipments(0).subscribe(res => {
      this.shipments.set(res.content); // Page object has 'content'
    });

    // Fetch Chart Stats
    this.dashboardService.getStats().subscribe(data => {
      this.chartData.set({
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

  // Computed properties for top stats
  totalVehicles = computed(() => new Set(this.shipments().map(s => s.vehicleId)).size);
  activeCount = computed(() => this.shipments().filter(s => s.status === 'IN_TRANSIT').length);

  columns = signal<TableColumn[]>([
    { field: 'shipmentNumber', header: 'ID' },
    { field: 'clientName', header: 'Customer' },
    { field: 'status', header: 'Status', type: 'badge' },
    { field: 'routeId', header: 'Route' },
    { field: 'dispatchedAt', header: 'Dispatched' }
  ]);

  initChartOptions() {
    this.chartOptions.set({
      plugins: { legend: { labels: { color: '#ebedef' } } },
      scales: {
        x: { ticks: { color: '#ebedef' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { ticks: { color: '#ebedef' }, grid: { color: 'rgba(255,255,255,0.05)' } }
      }
    });
  }

  viewDetails(row: any) { console.log('Details:', row); }
}