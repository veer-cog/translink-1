// pages/dashboard/dashboard.component.ts
import { Component, signal } from '@angular/core';
import { StatCardComponent } from '../shareable/components/stat-card.component/stat-card.component';
import { Alert, AlertListComponent } from '../shareable/components/alert-list.component/alert-list.component';
import { DashboardChartComponent } from "../shareable/components/dashboard-chart.component/dashboard-chart.component";
import { TableColumn, GenericTableComponent } from '../shareable/components/generic-table.component/generic-table.component';
import { LayoutComponent } from "../shareable/components/layout.component/layout.component";
import { TabFilterComponent } from "../shareable/components/tab-filter.component/tab-filter.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StatCardComponent, AlertListComponent, DashboardChartComponent, GenericTableComponent, LayoutComponent, TabFilterComponent],
  templateUrl: './dashboard.component.html',
styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  vehicleCols: TableColumn[] = [
  { field: 'id', header: 'Vehicle ID' },
  { field: 'type', header: 'Type' },
  { field: 'fuel', header: 'Fuel Level' },
  { field: 'status', header: 'Condition', type: 'badge' }
];

vehicleData = [
  { id: 'TRK-101', type: 'Heavy Truck', fuel: '75%', status: 'Active' },
  { id: 'TRK-089', type: 'Van', fuel: '12%', status: 'Booked' }
];
shipmentCols: TableColumn[] = [
  { field: 'id', header: 'Shipment ID' },
  { field: 'customer', header: 'Customer' },
  { field: 'status', header: 'Status', type: 'badge' },
  { field: 'vehicle', header: 'Vehicle' }
];

shipmentData = [
  { id: 'SH-2401', customer: 'Acme Corp', status: 'In Transit', vehicle: 'TRK-101' },
  { id: 'SH-2402', customer: 'Global Log', status: 'Booked', vehicle: 'TRK-045' },
    { id: 'SH-2401', customer: 'Acme Corp', status: 'In Transit', vehicle: 'TRK-101' },
  { id: 'SH-2402', customer: 'Global Log', status: 'Booked', vehicle: 'TRK-045' },
    { id: 'SH-2401', customer: 'Acme Corp', status: 'In Transit', vehicle: 'TRK-101' },
];
  recentAlerts = signal<Alert[]>([
    { vehicleId: '1', issue: 'Maintenance due',  priority: 'High' },
    { vehicleId: '2', issue: 'Delayed shipment SH102', priority:'Medium'},
        { vehicleId: '1', issue: 'Maintenance due',  priority: 'Low' },
  ]);
shipmentChartData = signal({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Completed',
        data: [65, 59, 80, 81, 56, 55, 90],
        fill: true,
        borderColor: '#0052cc', // Primary Blue
        backgroundColor: 'rgba(0, 82, 204, 0.1)', // Light blue fill
        tension: 0.4, // Curvy lines
        borderWidth: 2
      },
      {
        label: 'Canceled',
        data: [28, 48, 40, 19, 26, 27, 10],
        fill: true,
        borderColor: '#ef4444', // Red
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        tension: 0.4,
        borderWidth: 2
      }
    ]
  });

  shipmentChartOptions = signal({
    plugins: {
        legend: { display: true, position: 'top', align: 'end' }
    },
    scales: {
        y: { beginAtZero: true }
    }
  });

  // 2. Configuration for Revenue (Bar Chart) - Example
  revenueChartData = signal({
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
        {
            label: 'Revenue (k)',
            data: [50, 75, 60, 90],
            backgroundColor: '#10b981', // Emerald Green
            borderRadius: 6
        }
    ]
  });
  tabOptions = [
  { label: 'All Logs', value: 'all' },
  { label: 'Passed', value: 'passed' },
  { label: 'Action Required', value: 'action' }
];

activeValue = signal('all');
view: any;

onTabChange(value: string) {
  this.activeValue.set(value);
}
}


