import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TimelineModule } from 'primeng/timeline';

export interface Route {
  id: string;
  vehicleID: string;
  stops: string; // From Backend: "Hyd port, Hyd port"
  totalDistance: number;
  totalDuration: number;
  totalFuelExpense: number | null;
  companyId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  status?: string;
  optimizedPercent?: number;
}

@Component({
  selector: 'app-route-plans',
  templateUrl: './route-plans.html',
  styleUrls: ['./route-plans.scss'],
  standalone: true, // Assuming standalone based on your imports array
  imports: [
    CardModule,
    TagModule,
    ProgressBarModule,
    ButtonModule,
    DividerModule,
    TimelineModule,
    CommonModule
  ]
})
export class RoutePlans {
  @Input() route!: Route;
  @Input() showHeader = false;

  @Output() viewAnalysis = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Route>();

  /**
   * Helper to convert the backend string "Stop A, Stop B" 
   * into an array of objects for PrimeNG Timeline or lists.
   */
  get stopsArray() {
    if (!this.route.stops || typeof this.route.stops !== 'string') return [];
    return this.route.stops.split(',').map(name => ({
      name: name.trim(),
      type: 'stop'
    }));
  }

  get statusSeverity(): 'success' | 'info' | 'warn' | 'secondary' | 'danger' {
    if (this.route?.status) {
      const currentStatus = this.route.status.toLowerCase();
      if (currentStatus === 'active') return 'success';
      if (currentStatus === 'pending') return 'warn';
      if (currentStatus === 'completed') return 'info';
    }
    return 'secondary'; // Default fallback
  }

  onViewAnalysis() {
    this.viewAnalysis.emit(this.route.id);
  }

  onEditClick() {
    this.edit.emit(this.route);
  }

  viewOnMap(): void {
    // Since 'stops' is a string, split it, clean it, and join for Google Maps
    const stopsList = this.route.stops.split(',').map(s => s.trim());
    
    if (stopsList.length === 0) return;

    const origin = encodeURIComponent(stopsList[0]);
    const destination = encodeURIComponent(stopsList[stopsList.length - 1]);
    
    // Create waypoints if there are more than 2 stops
    let waypoints = '';
    if (stopsList.length > 2) {
      const middleStops = stopsList.slice(1, -1).join('|');
      waypoints = `&waypoints=${encodeURIComponent(middleStops)}`;
    }

    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints}`;
    window.open(url, '_blank');
  }

  startRoute() {
    this.route.status = 'Active'; // Changed to Active as it makes more sense for "starting"
    console.log(`Route ${this.route.id} has started!`);
  }
}