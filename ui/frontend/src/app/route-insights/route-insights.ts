import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../shareable/components/stat-card.component/stat-card.component';

export interface Stat { label: string; icon: string; value: string | number; trend?: string; isPositive?: boolean; color?: string; }
@Component({
  selector: 'app-route-insights',
  imports: [StatCardComponent, CommonModule],
  styleUrls: ['./route-insights.scss'], 
  templateUrl: './route-insights.html',
})
export class RouteInsights {
@Input({required:true}) stats: Stat[] = []; 
insightData = [
    { 
      label: 'Cost Savings', 
      description: 'Route optimization has saved $12,450 in fuel costs this month', 
      icon: 'pi pi-chart-line', 
      color: 'blue' 
    },
    { 
      label: 'Time Efficiency', 
      description: 'Average delivery time reduced by 18% with optimized routes', 
      icon: 'pi pi-clock', 
      color: 'green' 
    },
    { 
      label: 'Distance Reduction', 
      description: 'Total distance reduced by 850 miles through smart routing', 
      icon: 'pi pi-send', 
      color: 'purple' 
    }
  ];
}
