import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { MenuItem } from 'primeng/api';
import { StatCardComponent } from '../shareable/components/stat-card.component/stat-card.component';
import { TabFilterComponent } from '../shareable/components/tab-filter.component/tab-filter.component';
import { Alert, AlertListComponent } from '../shareable/components/alert-list.component/alert-list.component';
import { DashboardChartComponent } from '../shareable/components/dashboard-chart.component/dashboard-chart.component';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ComplianceLog {
  id: string; status: 'Passed' | 'Action Required'; date: string;
  type: string; vehicle: string; inspector: string;
  notes: string; nextDue: string;
}

@Component({
  selector: 'app-compliance',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, 
    DatePickerModule, MenuModule, DialogModule, SelectModule, TextareaModule,
    StatCardComponent, TabFilterComponent, AlertListComponent, DashboardChartComponent
  ],
  templateUrl: './compliance.component.html',
  styleUrl: './compliance.component.scss'
})
export class ComplianceComponent {
  private fb = inject(FormBuilder);
  allLogs = signal<ComplianceLog[]>([
    { id: 'LOG-001', status: 'Passed', date: '2025-01-10', type: 'Safety Inspection', vehicle: 'TRK-101', inspector: 'John Doe', notes: 'Clear', nextDue: '2025-07-10' },
    { id: 'LOG-002', status: 'Action Required', date: '2025-01-22', type: 'Emissions', vehicle: 'TRK-202', inspector: 'Sarah Smith', notes: 'High CO2', nextDue: '2025-02-10' },
    { id: 'LOG-003', status: 'Passed', date: '2025-02-05', type: 'Brake Check', vehicle: 'TRK-303', inspector: 'Mike Ross', notes: 'Good', nextDue: '2025-08-05' },
    { id: 'LOG-004', status: 'Passed', date: '2025-02-28', type: 'Safety Inspection', vehicle: 'TRK-404', inspector: 'John Doe', notes: 'Clear', nextDue: '2025-08-28' },
    { id: 'LOG-005', status: 'Action Required', date: '2025-03-12', type: 'Oil Analysis', vehicle: 'TRK-505', inspector: 'Sarah Smith', notes: 'Leaking', nextDue: '2025-03-20' },
    { id: 'LOG-006', status: 'Passed', date: '2025-03-25', type: 'Emissions', vehicle: 'TRK-606', inspector: 'Mike Ross', notes: 'Clear', nextDue: '2025-09-25' },
    { id: 'LOG-007', status: 'Passed', date: '2025-04-15', type: 'Brake Check', vehicle: 'TRK-707', inspector: 'John Doe', notes: 'Clear', nextDue: '2025-10-15' },
    { id: 'LOG-008', status: 'Action Required', date: '2025-05-02', type: 'Safety Inspection', vehicle: 'TRK-808', inspector: 'Sarah Smith', notes: 'Tire wear', nextDue: '2025-05-15' },
    { id: 'LOG-009', status: 'Passed', date: '2025-06-18', type: 'Oil Analysis', vehicle: 'TRK-909', inspector: 'Mike Ross', notes: 'Clear', nextDue: '2025-12-18' },
    { id: 'LOG-010', status: 'Passed', date: '2025-07-22', type: 'Emissions', vehicle: 'TRK-010', inspector: 'John Doe', notes: 'Clear', nextDue: '2026-01-22' },
    { id: 'LOG-011', status: 'Action Required', date: '2025-08-05', type: 'Brake Check', vehicle: 'TRK-011', inspector: 'Sarah Smith', notes: 'Pads thin', nextDue: '2025-08-20' },
    { id: 'LOG-012', status: 'Passed', date: '2025-09-14', type: 'Safety Inspection', vehicle: 'TRK-012', inspector: 'Mike Ross', notes: 'Clear', nextDue: '2026-03-14' },
    { id: 'LOG-013', status: 'Passed', date: '2025-10-01', type: 'Oil Analysis', vehicle: 'TRK-013', inspector: 'John Doe', notes: 'Clear', nextDue: '2026-04-01' },
    { id: 'LOG-014', status: 'Action Required', date: '2025-10-25', type: 'Emissions', vehicle: 'TRK-014', inspector: 'Sarah Smith', notes: 'Sensor fail', nextDue: '2025-11-10' },
    { id: 'LOG-015', status: 'Passed', date: '2025-11-11', type: 'Brake Check', vehicle: 'TRK-015', inspector: 'Mike Ross', notes: 'Clear', nextDue: '2026-05-11' },
    { id: 'LOG-016', status: 'Passed', date: '2025-11-29', type: 'Safety Inspection', vehicle: 'TRK-016', inspector: 'John Doe', notes: 'Clear', nextDue: '2026-05-29' },
    { id: 'LOG-017', status: 'Passed', date: '2025-12-12', type: 'Oil Analysis', vehicle: 'TRK-017', inspector: 'Sarah Smith', notes: 'Clear', nextDue: '2026-06-12' },
    { id: 'LOG-018', status: 'Action Required', date: '2025-12-28', type: 'Emissions', vehicle: 'TRK-018', inspector: 'Mike Ross', notes: 'Exhaust leak', nextDue: '2026-01-15' },
    { id: 'LOG-019', status: 'Passed', date: '2026-01-05', type: 'Brake Check', vehicle: 'TRK-019', inspector: 'John Doe', notes: 'Clear', nextDue: '2026-07-05' },
    { id: 'LOG-020', status: 'Passed', date: '2026-01-14', type: 'Safety Inspection', vehicle: 'TRK-020', inspector: 'Sarah Smith', notes: 'Clear', nextDue: '2026-07-14' }
  ]);

 statCards = computed(() => {
    const logs = this.allLogs();
    const total = logs.length;
    const passed = logs.filter(l => l.status === 'Passed').length;
    const actionRequired = logs.filter(l => l.status === 'Action Required').length;
    
    // Calculation: Compliance Rate
    const rate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;
    
    // Calculation: Avg Resolution Time (Mocked based on log volume)
    // In a real backend, this would calculate (ResolvedDate - DetectedDate)
    const avgDays = actionRequired > 0 ? (actionRequired * 1.5).toFixed(1) : "0";

    return [
      { label: 'Avg. Resolution', value: `${avgDays} Days`, icon: 'pi pi-clock', color: '#f97316' }, // Replaces On-Time Delivery
      { label: 'Total Logs', value: total.toString(), icon: 'pi pi-folder-open', color: '#3b82f6' },
      { label: 'Action Needed', value: actionRequired.toString(), icon: 'pi pi-wrench', color: '#ef4444' },
      { label: 'Compliance Rate', value: `${rate}%`, icon: 'pi pi-shield', color: '#8b5cf6' }
    ];
  });

  // --- DYNAMIC 12-MONTH CHART COMPUTATION ---
  complianceChartData = computed(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const passedCounts = new Array(12).fill(0);
    const actionCounts = new Array(12).fill(0);

    this.allLogs().forEach(log => {
      const monthIndex = new Date(log.date).getMonth();
      if (log.status === 'Passed') passedCounts[monthIndex]++;
      else actionCounts[monthIndex]++;
    });

    return {
      labels: months,
      datasets: [
        { label: 'Passed', data: passedCounts, backgroundColor: '#10b981', borderRadius: 4 },
        { label: 'Action Required', data: actionCounts, backgroundColor: '#f43f5e', borderRadius: 4 }
      ]
    };
  });

  // --- UI STATE & FILTERING ---
  view = signal<string>('All Logs');
  searchQuery = signal<string>('');
  dateFilter = signal<Date | null>(null);
  displayDialog = signal<boolean>(false);
  dialogMode = signal<'view' | 'action' | 'new'>('view');

  filteredLogs = computed(() => {
    let logs = this.allLogs();
    if (this.view() !== 'All Logs') logs = logs.filter(l => l.status === this.view());
    if (this.searchQuery()) logs = logs.filter(l => l.vehicle.toLowerCase().includes(this.searchQuery().toLowerCase()));
    if (this.dateFilter()) {
      const selectedStr = this.dateFilter()!.toLocaleDateString('en-CA');
      logs = logs.filter(l => l.date === selectedStr);
    }
    return logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  // --- FORM HANDLING ---
  complianceForm: FormGroup = this.fb.group({
    id: [''],
    vehicle: ['', Validators.required],
    type: ['', Validators.required],
    inspector: ['', Validators.required],
    notes: [''],
    date: [new Date(), Validators.required],
    status: ['Passed', Validators.required]
  });

  statusOptions = [{ label: 'Passed', value: 'Passed' }, { label: 'Action Required', value: 'Action Required' },{ label: 'Failed', value: 'Failed' }];
  typeOptions = [
    { label: 'Safety Inspection', value: 'Safety Inspection' },
    { label: 'Emissions Test', value: 'Emissions Test' },
    { label: 'Brake Check', value: 'Brake Check' },
    { label: 'Oil Analysis', value: 'Oil Analysis' }
  ];

  exportMenuItems: MenuItem[] = [
    { label: 'Export CSV', icon: 'pi pi-file-excel', command: () => this.exportCSV() },
    { label: 'Export PDF', icon: 'pi pi-file-pdf', command: () => this.exportPDF() }
  ];
// Inside ComplianceComponent class...

visibleLogsCount = signal<number>(3);

// Dynamic Alert logic
upcomingAlerts = computed(() => {
  const today = new Date();
  return this.allLogs()
    .filter(log => {
      const isActionRequired = log.status === 'Action Required';
      const isUpcoming = new Date(log.nextDue) > today;
      return isActionRequired || isUpcoming;
    })
    .map(log => ({
      vehicleId: log.vehicle,
      issue: log.type,
      priority: log.status === 'Action Required' ? 'High' : 'Medium',
      dueDate: log.nextDue
    }))
    .slice(0, 5) as Alert[];
});

displayLogs = computed(() => this.filteredLogs().slice(0, this.visibleLogsCount()));
hasMoreLogs = computed(() => this.visibleLogsCount() < this.filteredLogs().length);

loadMore() { this.visibleLogsCount.update(n => n + 5); }
  // --- ACTIONS ---
  openModal(mode: 'view' | 'action' | 'new', log?: ComplianceLog) {
    this.dialogMode.set(mode);
    this.complianceForm.reset();
    if (log) {
      this.complianceForm.patchValue({ ...log, date: new Date(log.date) });
    } else {
      this.complianceForm.patchValue({ id: `LOG-${Math.floor(Math.random() * 900) + 100}`, status: 'Passed', date: new Date() });
    }
    mode === 'view' ? this.complianceForm.disable() : this.complianceForm.enable();
    this.displayDialog.set(true);
  }

  saveLog() {
    if (this.complianceForm.invalid) return;
    const formValue = this.complianceForm.getRawValue();
    const formattedLog: ComplianceLog = {
      ...formValue,
      date: formValue.date instanceof Date ? formValue.date.toISOString().split('T')[0] : formValue.date,
      nextDue: '2026-12-31' 
    };
    if (this.dialogMode() === 'new') {
      this.allLogs.update(logs => [formattedLog, ...logs]);
    } else {
      this.allLogs.update(logs => logs.map(l => l.id === formattedLog.id ? formattedLog : l));
    }
    this.displayDialog.set(false);
  }

  exportCSV() {
    const dateStr = this.getExportDateString();
    const csv = ["ID,Status,Date,Vehicle,Inspector", ...this.filteredLogs().map(l => `${l.id},${l.status},${l.date},${l.vehicle},${l.inspector}`)].join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `Compliance_Logs${dateStr}.csv`; a.click();
  }

exportPDF() {
  const dateStr = this.getExportDateString();
  const doc = new jsPDF();
  
  // 1. Metadata for the report
  const generatedBy = 'Admin User'; // Replace with your actual username variable
  const timestamp = new Date().toLocaleString();

  // 2. Add Header (Title and Metadata)
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59); 
  doc.text('Compliance Logs Report', 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated By: ${generatedBy}`, 14, 28);
  doc.text(`Export Date: ${timestamp}`, 14, 34);
  
  // 3. Generate Table
  autoTable(doc, {
    startY: 42, 
    head: [['ID', 'Status', 'Date', 'Vehicle', 'Inspector']],
    body: this.filteredLogs().map(l => [
      l.id, 
      l.status, 
      l.date, 
      l.vehicle, 
      l.inspector
    ]),
    headStyles: { 
      fillColor: [29, 97, 255], // Match primary blue
      fontSize: 10,
      cellPadding: 3
    },
    alternateRowStyles: { 
      fillColor: [248, 250, 252] 
    },
    margin: { top: 42 },
    didDrawPage: (data) => {
      // FIX: Use the pages array length to get the current page number
      const pageCount = doc.internal.pages.length - 1;
      const str = 'Page ' + pageCount;
      
      doc.setFontSize(8);
      doc.setTextColor(150);
      
      const pageSize = doc.internal.pageSize;
      const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
      
      // Draw at the bottom of the page
      doc.text(str, 14, pageHeight - 10);
    }
  });
  doc.save(`compliance_logs_${dateStr}.pdf`);
}
private getExportDateString(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  return `${day}_${month}_${year}`;
}
}