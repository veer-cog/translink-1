import { Component, input, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-dashboard-chart',
  standalone: true,
  imports: [CommonModule, ChartModule],
  template: `
    <div class="chart-card">
      <div class="chart-header" *ngIf="title()">
        <h3>{{ title() }}</h3>
        </div>

      <div class="chart-container">
        <p-chart
          [type]="type()"
          [data]="data()"
          [options]="mergedOptions()"
          [height]="height()"
          [width]="'100%'">
        </p-chart>
      </div>
    </div>
  `,
  styles: [`
    .chart-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .chart-header {
      margin-bottom: 1.5rem;
      h3 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: #1e293b;
      }
    }

    .chart-container {
      flex: 1;
      position: relative;
      min-height: 0; /* Critical for Flexbox resizing */
    }
  `]
})
export class DashboardChartComponent {
  // 1. Required Inputs
  data = input.required<any>(); // The Chart.js data object

  // 2. Configurable Inputs with Defaults
  type = input<'bar' | 'line' | 'scatter' | 'bubble' | 'pie' | 'doughnut' | 'polarArea' | 'radar'>('line'); // 'line' | 'bar' | 'doughnut' | 'pie'
  title = input<string>('');    // Title displayed at top
  height = input<string>('300px');

  // 3. Options Input (we will merge this with default styles)
  options = input<any>({});

  // 4. Internal merged options to ensure it always looks good
  protected mergedOptions = signal<any>({});

  constructor() {
    // Effect to merge user options with default "pretty" styles
    effect(() => {
      const userOpts = this.options();
      const defaultOpts = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { usePointStyle: true, color: '#64748b' },
            position: 'bottom'
          }
        },
        scales: this.type() === 'doughnut' || this.type() === 'pie' ? {} : {
          x: {
            grid: { display: false, drawBorder: false },
            ticks: { color: '#94a3b8' }
          },
          y: {
            grid: { color: '#f1f5f9', drawBorder: false },
            ticks: { color: '#94a3b8' },
            beginAtZero: true
          }
        }
      };

      // Deep merge or simple spread (using simple spread here for performance)
      this.mergedOptions.set({ ...defaultOpts, ...userOpts });
    });
  }
}
