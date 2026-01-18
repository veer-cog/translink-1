import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../shareable/components/stat-card.component/stat-card.component';
import { DashboardChartComponent } from '../shareable/components/dashboard-chart.component/dashboard-chart.component';
import { TabFilterComponent } from '../shareable/components/tab-filter.component/tab-filter.component';
import { GenericTableComponent, TableColumn } from '../shareable/components/generic-table.component/generic-table.component';


@Component({
  selector: 'app-analytics-reports',
  standalone: true,
  imports: [
    CommonModule, 
    StatCardComponent, 
    DashboardChartComponent, 
    TabFilterComponent, 
    GenericTableComponent,
  ],
  templateUrl: './analytics-reports.component.html',
  styleUrls: ['./analytics-reports.component.scss']
})
export class AnalyticsReportsComponent {
  // Filters
  timeTabs = ['Last Week', 'Last Month', 'Last Year'];

  // Stat Cards cv



  stats = [
    { label: 'Total Revenue', value: '$485,200', trend: '12.5%', isPos: true, icon: 'pi pi-indian-rupee', col: '#10b981' },
    { label: 'Total Deliveries', value: '1,342', trend: '8.3%', isPos: true, icon: 'pi pi-box', col: '#3b82f6' },
    { label: 'Profit Margin', value: '75.4%', trend: '2.1%', isPos: true, icon: 'pi pi-chart-line', col: '#f59e0b' },
    { label: 'Fleet Utilization', value: '87%', trend: '5.2%', isPos: true, icon: 'pi pi-truck', col: '#ef4444' }
  ];

  // Chart Setup
  chartData = {
    labels: ['Jan', 'Dec', 'Nov', 'Oct', 'Sep', 'Aug'],
    datasets: [
      { label: 'Revenue', backgroundColor: '#3b82f6', data: [460, 440, 410, 430, 420, 400], borderRadius: 6 },
      { label: 'Cost', backgroundColor: '#ff6b6b', data: [75, 80, 85, 90, 70, 80], borderRadius: 6 }
    ]
  };

  chartOptions = {
    scales: { x: { stacked: true }, y: { stacked: true, display: false } }
  };

  // Cost Analysis (Middle Section)
  costAnalysis = [
    { label: 'Fuel', amt: '$45,600', pct: 38 },
    { label: 'Maintenance', amt: '$28,400', pct: 24 },
    { label: 'Labor', amt: '$32,100', pct: 27 },
    { label: 'Insurance', amt: '$13,200', pct: 11 }
  ];

  // Table Configuration
  tableCols: TableColumn[] = [
    { field: 'shipmentId', header: 'Shipment ID', type: 'text' },
    { field: 'route', header: 'Route', type: 'text' },
    { field: 'date', header: 'Date', type: 'date' },
    { field: 'status', header: 'Status', type: 'badge' },
    { field: 'cost', header: 'Cost', type: 'text' }
  ];

  tableData = [
    { shipmentId: 'SHP-001', route: 'New York -> London', date: '2026-01-10', status: 'delivered', cost: '$1,200' },
    { shipmentId: 'SHP-002', route: 'Paris -> Berlin', date: '2026-01-12', status: 'in-transit', cost: '$850' },
    { shipmentId: 'SHP-003', route: 'Tokyo -> Sydney', date: '2026-01-13', status: 'booked', cost: '$2,100' }
  ];
}
