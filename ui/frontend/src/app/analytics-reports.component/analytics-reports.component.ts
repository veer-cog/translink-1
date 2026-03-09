// src/app/analytics-reports/analytics-reports.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../services/analytics-service';
import { StatCardComponent } from '../shareable/components/stat-card.component/stat-card.component';
import { DashboardChartComponent } from '../shareable/components/dashboard-chart.component/dashboard-chart.component';
import { TabFilterComponent } from '../shareable/components/tab-filter.component/tab-filter.component';
import { GenericTableComponent, TableColumn } from '../shareable/components/generic-table.component/generic-table.component';

@Component({
  selector: 'app-analytics-reports',
  standalone: true,
  imports: [CommonModule, StatCardComponent, DashboardChartComponent, TabFilterComponent, GenericTableComponent],
  templateUrl: './analytics-reports.component.html',
  styleUrls: ['./analytics-reports.component.scss']
})
export class AnalyticsReportsComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);

  // Default UI State
  timeTabs = ['Last Week', 'Last Month', 'Last Year'];
  isLoading = false;
  
  // Table & Chart Configuration
  tableCols: TableColumn[] = [
    { field: 'shipmentId', header: 'Shipment ID', type: 'text' },
    { field: 'route', header: 'Route', type: 'text' },
    { field: 'date', header: 'Date', type: 'date' },
    { field: 'status', header: 'Status', type: 'badge' },
    { field: 'cost', header: 'Cost', type: 'text' }
  ];

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { stacked: true }, y: { stacked: true } }
  };

  // Data variables
  stats: any[] = [];
  chartData: any = { labels: [], datasets: [] };
  costAnalysis: any[] = [];
  tableData: any[] = [];
  totalOperatingCost = 0;

  ngOnInit() {
    // Force "month" as the default load period immediately
    this.loadData('month'); 
  }

  onTabChange(tabLabel: string) {
    const mapping: any = { 'Last Week': 'week', 'Last Month': 'month', 'Last Year': 'year' };
    this.loadData(mapping[tabLabel] || 'month');
  }

  private loadData(period: string) {
    this.isLoading = true;
    this.analyticsService.getDashboardData(period).subscribe({
      next: (res) => {
        this.mapSummary(res.summary);
        this.mapTrends(res.trends);
        this.mapCosts(res.costs);
        this.tableData = res.operations || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Critical fetch error:", err);
        this.isLoading = false;
      }
    });
  }

  private mapSummary(summary: any) {
    if (!summary) return;
    this.stats = [
      { label: 'Total Revenue', value: `$${(summary.totalRevenue || 0).toLocaleString()}`, trend: summary.revenueChangeLabel, icon: 'pi pi-indian-rupee', col: '#2522cfff' },
      { label: 'Total Deliveries', value: (summary.totalDeliveries || 0).toLocaleString(), trend: summary.deliveriesChangeLabel, icon: 'pi pi-box', col: '#df145bff' },
      { label: 'Profit Margin', value: `${summary.profitMargin || 0}%`, trend: summary.marginChangeLabel, icon: 'pi pi-chart-line', col: '#15940cff' },
      { label: 'Fleet Utilization', value: `${(summary.fleetUtilization || 0).toFixed(1)}%`, trend: summary.utilizationChangeLabel, icon: 'pi pi-truck', col: '#57a4c7ff' }
    ];
  }

  private mapTrends(trends: any[]) {
    this.chartData = {
      labels: trends?.map(t => t.month) || [],
      datasets: [
        { label: 'Revenue', backgroundColor: '#3b82f6', data: trends?.map(t => t.revenue) || [], borderRadius: 6 },
        { label: 'Cost', backgroundColor: '#ff6b6b', data: trends?.map(t => t.cost) || [], borderRadius: 6 }
      ]
    };
  }

  private mapCosts(costs: any) {
    if (!costs) return;
    this.totalOperatingCost = costs.totalOperatingCost || 0;
    const base = this.totalOperatingCost || 1;
    this.costAnalysis = [
      { label: 'Fuel', amt: `$${(costs.fuel || 0).toLocaleString()}`, pct: Math.round(((costs.fuel || 0) / base) * 100) },
      { label: 'Maintenance', amt: `$${(costs.maintenance || 0).toLocaleString()}`, pct: Math.round(((costs.maintenance || 0) / base) * 100) },
      { label: 'Labor', amt: `$${(costs.labor || 0).toLocaleString()}`, pct: Math.round(((costs.labor || 0) / base) * 100) }
    ];
  }
}