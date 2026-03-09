import { Component, inject, OnInit, signal, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../services/analytics-service';
import { StatCardComponent } from '../shareable/components/stat-card.component/stat-card.component';
import { DashboardChartComponent } from '../shareable/components/dashboard-chart.component/dashboard-chart.component';
import { TabFilterComponent } from '../shareable/components/tab-filter.component/tab-filter.component';
import { GenericTableComponent, TableColumn } from '../shareable/components/generic-table.component/generic-table.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-analytics-reports',
  standalone: true,
  imports: [CommonModule, StatCardComponent, DashboardChartComponent, TabFilterComponent, GenericTableComponent],
  templateUrl: './analytics-reports.component.html',
  styleUrls: ['./analytics-reports.component.scss']
})
export class AnalyticsReportsComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);

  @ViewChild(DashboardChartComponent) chartComponent!: DashboardChartComponent;
  // UI State
  timeTabs = ['Last Week', 'Last Month', 'Last Year'];
  isLoading = false;
  
  // Signals
  totalOperatingCost = signal<number>(0);

  // Data variables
  stats: any[] = [];
  chartData: any = { labels: [], datasets: [] };
  costAnalysis: any[] = [];
  tableData: any[] = [];

  tableCols: TableColumn[] = [
    { field: 'shipmentId', header: 'Shipment ID', type: 'text' },
    { field: 'route', header: 'Route', type: 'text' },
    { field: 'date', header: 'Date', type: 'date' },
    { field: 'status', header: 'Status', type: 'badge' },
    { field: 'cost', header: 'Cost', type: 'text' }
  ];

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { stacked: true }, y: { stacked: true } }
  };

  ngOnInit() {
    this.loadData('month'); 
  }

  onTabChange(tabLabel: string) {
    const mapping: any = { 'Last Week': 'week', 'Last Month': 'month', 'Last Year': 'year' };
    this.loadData(mapping[tabLabel] || 'month');
  }

  private loadData(period: string) {
    this.isLoading = true;
    this.analyticsService.getDashboardData(period).subscribe({
      next: (res) => {
        // IMPORTANT: Update costs FIRST so the signal is set before trends use it
        this.mapCosts(res.costs);
        this.mapTrends(res.trends);
        this.mapSummary(res.summary);
        
        this.tableData = res.operations || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Critical fetch error:", err);
        this.isLoading = false;
      }
    });
  }

  private mapSummary(summary: any) {
    if (!summary) return;
    this.stats = [
      { label: 'Total Revenue', value: `$${(summary.totalRevenue || 0).toLocaleString()}`, trend: summary.revenueChangeLabel, icon: 'pi pi-indian-rupee', col: '#2522cfff' },
      { label: 'Total Deliveries', value: (summary.totalDeliveries || 0).toLocaleString(), trend: summary.deliveriesChangeLabel, icon: 'pi pi-box', col: '#df145bff' },
      { label: 'Profit Margin', value: `${summary.profitMargin || 0}%`, trend: summary.marginChangeLabel, icon: 'pi pi-chart-line', col: '#15940cff' },
      { label: 'Fleet Utilization', value: `${(summary.fleetUtilization || 0).toFixed(1)}%`, trend: summary.utilizationChangeLabel, icon: 'pi pi-truck', col: '#57a4c7ff' }
    ];
  }

  private mapTrends(trends: any[]) {
    // Access the current value of the signal using ()
    const currentTotalCost = this.totalOperatingCost();

    this.chartData = {
      labels: trends?.map(t => t.month) || [],
      datasets: [
        { 
          label: 'Revenue', 
          backgroundColor: '#3b82f6', 
          data: trends?.map(t => t.revenue) || [], 
          borderRadius: 6 
        },
        { 
          label: 'Cost', 
          backgroundColor: '#ff6b6b', 
          // Fill the chart with the signal's value for each label
          data: trends?.map(() => currentTotalCost) || [], 
          borderRadius: 6 
        }
      ]
    };
  }

  private mapCosts(costs: any) {
    if (!costs) return;

    // 1. Calculate sum from raw data
    const total = (costs.fuel || 0) + (costs.maintenance || 0) + (costs.labor || 0);
    
    // 2. Update the signal correctly using .set()
    this.totalOperatingCost.set(total);

    // 3. Use the signal value for the percentages (Math.max handles division by zero)
    const base = Math.max(this.totalOperatingCost(), 1);

    this.costAnalysis = [
      { 
        label: 'Fuel', 
        amt: `$${(costs.fuel || 0).toLocaleString()}`, 
        pct: Math.round(((costs.fuel || 0) / base) * 100) 
      },
      { 
        label: 'Maintenance', 
        amt: `$${(costs.maintenance || 0).toLocaleString()}`, 
        pct: Math.round(((costs.maintenance || 0) / base) * 100) 
      },
      { 
        label: 'Labor', 
        amt: `$${(costs.labor || 0).toLocaleString()}`, 
        pct: Math.round(((costs.labor || 0) / base) * 100) 
      }
    ];
  }
async exportReport() {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 20;

    // 1. Header
    doc.setFontSize(20);
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.text('Logistics Analytics Executive Summary', 14, currentY);
    
    currentY += 10;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Report Period: ${new Date().toLocaleDateString()}`, 14, currentY);
    
    // 2. Stats Grid (Manual layout for "Cards" look)
    currentY += 15;
    autoTable(doc, {
      startY: currentY,
      head: [['Metric', 'Value', 'Trend']],
      body: this.stats.map(s => [s.label, s.value, s.trend]),
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;

    // 3. CAPTURE & ADD THE GRAPH
    const chartImg = this.chartComponent.getChartImage();
    if (chartImg) {
      doc.setFontSize(14);
      doc.text('Revenue & Cost Trends', 14, currentY);
      doc.addImage(chartImg, 'PNG', 14, currentY + 5, pageWidth - 28, 60);
      currentY += 75;
    }

    // 4. Cost Analysis
    doc.setFontSize(14);
    doc.text('Cost Breakdown', 14, currentY);
    autoTable(doc, {
      startY: currentY + 5,
      head: [['Category', 'Amount', 'Percentage']],
      body: this.costAnalysis.map(c => [c.label, c.amt, `${c.pct}%`]),
      foot: [['Total', `$${this.totalOperatingCost().toLocaleString()}`, '100%']],
      theme: 'grid'
    });

    // 5. Full Operations (New Page)
    doc.addPage();
    doc.text('Detailed Operations Log', 14, 20);
    autoTable(doc, {
      startY: 25,
      head: [this.tableCols.map(c => c.header)],
      body: this.tableData.map(row => [
        row.shipmentId, row.route, row.date, row.status, row.cost
      ])
    });

    doc.save('Logistics_Report.pdf');
  }
}