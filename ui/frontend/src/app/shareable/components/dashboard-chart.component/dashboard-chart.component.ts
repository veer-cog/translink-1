import { Component, input, effect, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule, UIChart } from 'primeng/chart'; // Import UIChart

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
        <p-chart #chartRef
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
    .chart-card { background: #ffffff; border-radius: 12px; padding: 1.5rem; border: 1px solid #e2e8f0; height: 100%; display: flex; flex-direction: column; }
    .chart-header { margin-bottom: 1.5rem; h3 { margin: 0; font-size: 1.1rem; color: #1e293b; } }
    .chart-container { flex: 1; position: relative; min-height: 0; }
  `]
})
export class DashboardChartComponent {
  // Access the PrimeNG UIChart component
  @ViewChild('chartRef') chartRef!: UIChart;

  data = input.required<any>();
  type = input<'bar' | 'line' | 'scatter' | 'bubble' | 'pie' | 'doughnut' | 'polarArea' | 'radar'>('line');
  title = input<string>('');
  height = input<string>('300px');
  options = input<any>({});

  protected mergedOptions = signal<any>({});

  constructor() {
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
        scales: (this.type() === 'doughnut' || this.type() === 'pie') ? {} : {
          x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
          y: { grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8' }, beginAtZero: true }
        }
      };
      this.mergedOptions.set({ ...defaultOpts, ...userOpts });
    });
  }

  /**
   * Helper for the Parent to get the Base64 image of the chart
   */
  getChartImage(): string | null {
    if (this.chartRef && this.chartRef.chart) {
      return this.chartRef.chart.canvas.toDataURL('image/png', 1.0);
    }
    return null;
  }
}