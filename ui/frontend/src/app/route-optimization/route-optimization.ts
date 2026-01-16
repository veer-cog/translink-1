import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardChartComponent } from '../shareable/components/dashboard-chart.component/dashboard-chart.component';
import { StatCardComponent } from '../shareable/components/stat-card.component/stat-card.component';
import { Route, RoutePlans } from '../route-plans/route-plans';
import { RouteInsights } from "../route-insights/route-insights";
import { RouteFormComponent } from '../routeform/routeform';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-route-optimization',
  imports: [DashboardChartComponent, StatCardComponent, CommonModule, RoutePlans, RouteInsights,RouteFormComponent,FormsModule],
  templateUrl: './route-optimization.html',
  styleUrl: './route-optimization.scss',
})
export class RouteOptimization {

  showModal = false;
  selectedRoute: Route | null = null;
  
  stats = [ { label: 'Active Routes', value: '24', icon: 'pi pi-send', color: '#0000ff' },
  { label: 'Avg. Optimization', value: '92%', icon: 'pi pi-chart-line', color: '#008000' },
  { label: 'Total Distance', value: '4,250mi', icon: 'pi pi-map-marker', color: '#800080' },
  { label: 'Est. Fuel Cost', value: '$2,145', icon: 'pi pi-clock', color: '#ffa500' } ];

  routes: Route[] = [
     { id: 'RT-001', 
      status: 'Pending', 
      optimizedPercent: 94, 
      vehicleId: 'TRK-101', 
      costUSD: 142, 
      totalDistanceMiles: 285, 
      estimatedTime: '6h 30m', 
      shipmentsAssigned: 3, 
      stops: [ 
        { city: 'New York', state: 'NY', type: 'start' }, 
        { city: 'Philadelphia', state: 'PA', type: 'stop' }, 
        { city: 'Baltimore', state: 'MD', type: 'stop' }, 
        { city: 'Washington', state: 'DC', type: 'end' } ] 
      }, 
      { id: 'RT-002', 
        status: 'Active', 
        optimizedPercent: 92, 
        vehicleId: 'TRK-102', 
        costUSD: 158, 
        totalDistanceMiles: 310, 
        estimatedTime: '7h 10m', 
        shipmentsAssigned: 4, 
        stops: [ 
          { city: 'Boston', state: 'MA', type: 'start' }, 
          { city: 'Hartford', state: 'CT', type: 'stop' }, 
          { city: 'Newark', state: 'NJ', type: 'stop' }, 
          { city: 'New York', state: 'NY', type: 'end' } ] 
        }, 
        { id: 'RT-003', 
          status: 'Completed', 
          optimizedPercent: 96, 
          vehicleId: 'TRK-103', 
          costUSD: 165, 
          totalDistanceMiles: 295, 
          estimatedTime: '6h 45m', 
          shipmentsAssigned: 5, 
          stops: [ 
            { city: 'Chicago', state: 'IL', type: 'start' }, 
            { city: 'Indianapolis', state: 'IN', type: 'stop' }, 
            { city: 'Columbus', state: 'OH', type: 'stop' }, 
            { city: 'Pittsburgh', state: 'PA', type: 'end' } 
          ] 
        } ]; 

        closeModal() { this.showModal = false; }

        openCreateModal(route?: Route) { 
          this.selectedRoute = route || null; // If route exists, we are editing; otherwise, creating
          this.showModal = true; 
}
      }






