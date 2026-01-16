import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-route-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './routeform.html',
  styleUrl: './routeform.scss'
})
export class RouteFormComponent {
  @Output() close = new EventEmitter<void>();

  // Array to manage dynamic stops
  stops = ['', '']; 

  closeModal() {
    this.close.emit();
  }

  addStop() {
    this.stops.push('');
  }
}