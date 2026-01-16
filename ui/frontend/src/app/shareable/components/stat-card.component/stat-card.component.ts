import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card" [style.background-color]="cardBg()">
      <div class="icon-container" [style.background-color]="bgTint()">
        
        <div class="icon-circle" [style.border-color]="color()">
          
          <i [class]="icon()" [style.color]="color()"></i>
          
        </div>
      </div>
      
      <div class="data-container">
        <span class="label">{{ label() }}</span>
        <h3 class="value">{{ value() }}</h3>
        
        @if (trend()) {
          <div class="trend-wrapper" [class.up]="isPositive()" [class.down]="!isPositive()">
             <span>{{ isPositive() ? '↑' : '↓' }} {{ trend() }} from last month</span>
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent {
  label = input.required<string>();
  icon = input<string>('pi pi-box'); 
  value = input.required<string | number>();
  trend = input<string | null>(null);
  isPositive = input<boolean>(true);
  
  // Provide the HEX color here (e.g., #10b981 for green)
  color = input<string>('#10b981'); 
cardBg = input<string>('var(--p-surface-0)');
  // This creates the light green background (10% alpha)
  // '1A' is the hex equivalent of 10% opacity
  bgTint = computed(() => `${this.color()}1A`);
}