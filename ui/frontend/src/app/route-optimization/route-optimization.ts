import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Shared Components
import { DashboardChartComponent } from '../shareable/components/dashboard-chart.component/dashboard-chart.component';
import { StatCardComponent } from '../shareable/components/stat-card.component/stat-card.component';
import { RoutePlans, Route } from '../route-plans/route-plans';
import { RouteInsights } from "../route-insights/route-insights";
import { RouteFormComponent } from '../routeform/routeform';

// The Connection Service
import { RouteApiService } from '../services/route';

@Component({
  selector: 'app-route-optimization',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    DashboardChartComponent, 
    StatCardComponent, 
    RoutePlans, 
    RouteInsights, 
    RouteFormComponent
  ],
  templateUrl: './route-optimization.html',
  styleUrl: './route-optimization.scss',
})
export class RouteOptimization implements OnInit {
  private router = inject(Router);
  private apiService = inject(RouteApiService);

  availablePorts: any[] = []; 
  selectedStops: any[] = [];
  
  showModal = false;
  selectedRoute: Route | null = null;
  routes: Route[] = []; 

  stats = [
    { label: 'Active Routes', value: '0', icon: 'pi pi-send', color: '#0000ff' },
    { label: 'Avg. Optimization', value: '92%', icon: 'pi pi-chart-line', color: '#008000' },
    { label: 'Total Distance', value: '0 mi', icon: 'pi pi-map-marker', color: '#800080' },
    { label: 'Est. Fuel Cost', value: '$0', icon: 'pi pi-clock', color: '#ffa500' }
  ];

  ngOnInit() {
    this.refreshRoutes();
  }

  refreshRoutes() {
    this.apiService.getRoutes().subscribe({
      next: (data: Route[]) => {
        // Since your Interface now matches the JSON, we don't need to transform every field.
        // We just ensure the UI state updates.
        this.routes = [...data]; 

        this.updateDashboardStats(this.routes);
        console.log("Routes loaded successfully from Backend:", this.routes);
      },
      error: (err) => console.error("API Error:", err)
    });
  }

  updateDashboardStats(currentRoutes: Route[]) {
    // 1. Total Count of Routes from DB
    this.stats[0].value = currentRoutes.length.toString();
    
    // 2. Total Distance (using your new interface key: totalDistance)
    const totalMiles = currentRoutes.reduce((sum, r) => sum + (r.totalDistance || 0), 0);
    this.stats[2].value = `${totalMiles.toLocaleString()} mi`;

    // 3. Total Fuel Cost (using your new interface key: totalFuelExpense)
    const totalCost = currentRoutes.reduce((sum, r) => sum + (r.totalFuelExpense || 0), 0);
    this.stats[3].value = `$${totalCost.toLocaleString()}`;
  }

  handleFormSubmit(updatedRoute: any) {
    // If you just saved to the DB, refresh the whole list to show the new entry with its Real ID
    // this.refreshRoutes(); 
    // this.closeModal();
    const index = this.routes.findIndex(r => r.id === updatedRoute.id);

  if (index > -1) {
    // Replace old route with new optimized route from backend
    this.routes[index] = updatedRoute;
    this.routes = [...this.routes]; // Trigger refresh
  } else {
    // It's a new route
    this.refreshRoutes();
  }
  this.updateDashboardStats(this.routes);
  this.closeModal();
  }

  openCreateModal(route?: Route) { 
    // Use spread operator to avoid modifying the list item directly before saving
    this.selectedRoute = route ? { ...route } : null; 
    this.showModal = true; 
  }

  closeModal() { 
    this.showModal = false; 
    this.selectedRoute = null;
  }

  viewAnalysis(id: string) {
    this.router.navigate(['/admin/routes/analysis', id]);
  }
}