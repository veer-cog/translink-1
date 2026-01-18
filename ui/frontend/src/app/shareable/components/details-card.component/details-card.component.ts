import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DetailItem {
  label: string;
  value: any;
}

@Component({
  selector: 'app-details-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details-card.component.html',
  styleUrl: './details-card.component.scss'
})
export class DetailsCardComponent {
  title = input<string>('Details');
  isVisible = signal(false);
  details: DetailItem[] = [];

  show(data: any) {
    this.details = Object.entries(data)
      .filter(([key, value]) => key !== 'actions')
      .map(([key, value]) => ({
        label: this.formatLabel(key),
        value: value
      }));
    this.isVisible.set(true);
  }

  close() {
    this.isVisible.set(false);
    this.details = [];
  }

  private formatLabel(key: string): string {
    // Convert camelCase or snake_case to Title Case
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  getValueClass(value: any): string {
    if (typeof value === 'string') {
      if (value.toLowerCase().includes('active')) return 'badge-active';
      if (value.toLowerCase().includes('maintenance')) return 'badge-maintenance';
      if (value.toLowerCase().includes('inactive')) return 'badge-inactive';
      if (value.toLowerCase().includes('delivered')) return 'badge-delivered';
      if (value.toLowerCase().includes('transit')) return 'badge-transit';
      if (value.toLowerCase().includes('booked')) return 'badge-booked';
      if (value.toLowerCase().includes('high')) return 'badge-high';
      if (value.toLowerCase().includes('medium')) return 'badge-medium';
      if (value.toLowerCase().includes('low')) return 'badge-low';
    }
    return '';
  }

  isBadge(value: any): boolean {
    if (typeof value !== 'string') return false;
    const badgeKeywords = ['active', 'maintenance', 'inactive', 'delivered', 'transit', 'booked', 'high', 'medium', 'low'];
    return badgeKeywords.some(keyword => value.toLowerCase().includes(keyword));
  }
}
