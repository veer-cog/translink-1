import { Component, Input,Output,EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TimelineModule } from 'primeng/timeline';


export interface Route {
  id: string;
  status: string;
  optimizedPercent: number;
  vehicleId: string;
  costUSD: number;
  totalDistanceMiles: number;
  estimatedTime: string;
  shipmentsAssigned: number;
  stops: { city: string; state: string; type: 'start' | 'stop' | 'end' }[];
}
@Component({
  selector: 'app-route-plans',
  templateUrl: './route-plans.html',
  styleUrls: ['./route-plans.scss'],
  imports:[CardModule,TagModule,ProgressBarModule,ButtonModule,DividerModule,TimelineModule,CommonModule]
})


export class RoutePlans {

  @Input() route!: Route;
  @Input() showHeader=false;
 get statusSeverity(): 'success' | 'info' | 'warn' | 'danger' {
  // Use 'this.route.status' instead of just 'status'
  const currentStatus = this.route.status.toLowerCase();

  if (currentStatus === 'active') return 'success';
  if (currentStatus === 'pending') return 'warn';
  if (currentStatus === 'completed') return 'info';
  
  return 'danger';
}
viewOnMap(): void { 
  const stops = this.route.stops.map(s => `${s.city},${s.state}`).join('/'); 
  const url = `https://www.google.com/maps/dir/${stops}`; 
  window.open(url, '_blank'); }

  editRoute(): void {
    console.log('Edit Route clicked');
  }
  @Output() edit = new EventEmitter<any>();

  onEditClick() {
    this.edit.emit(this.route); 
  }
  // Inside RoutePlans component class
startRoute() {
  this.route.status = 'Pending';
  console.log(`Route ${this.route.id} has started!`);
}
}



