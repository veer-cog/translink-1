import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Alert {
  vehicleId: string;
  issue: string;
  priority: 'Low' | 'Medium' | 'High';
}

@Component({
  selector: 'app-alert-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-list.component.html',
  styleUrl: './alert-list.component.scss'
})
export class AlertListComponent {
  alerts = input.required<Alert[]>();

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#3b82f6';
      default: return '#64748b';
    }
  }
}