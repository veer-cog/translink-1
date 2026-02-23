import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select'; // Updated to Select
import { DatePicker } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-activity-logs',
  standalone: true,
  imports: [
    CommonModule, TableModule, TagModule, InputTextModule, 
    ButtonModule, TooltipModule, SelectModule, DatePicker, FormsModule
  ],
  templateUrl: './activity-logs.component.html',
  styleUrl: './activity-logs.component.scss'
})
export class ActivityLogs implements OnInit {
  @ViewChild('dt') dt: Table | undefined;

  logs: any[] = [];
  statuses: any[] = [
    { label: 'Info', value: 'info' },
    { label: 'Warning', value: 'warning' },
    { label: 'Danger', value: 'danger' }
  ];

  ngOnInit() {
    this.generateMockData();
  }

  generateMockData() {
    const types = ['SHIPMENT', 'VEHICLE', 'ROUTE'];
    const severities = ['info', 'warning', 'danger'];
    const operators = ['sarah.admin', 'robert.driver', 'system.monitor', 'john.logistics'];
    
    const mockLogs = [];
    for (let i = 1; i <= 20; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      mockLogs.push({
        id: 500 + i,
        entityType: type,
        entityId: `${type.substring(0, 3)}-${1000 + i}`,
        activity: this.getActivityDescription(type, i),
        performedBy: operators[Math.floor(Math.random() * operators.length)],
        timestamp: new Date(2026, 0, 30, 8 + (i % 8), i * 2),
        severity: severities[Math.floor(Math.random() * severities.length)]
      });
    }
    this.logs = mockLogs;
  }

  getActivityDescription(type: string, i: number): string {
    if (type === 'SHIPMENT') return `Package ${i % 2 === 0 ? 'Delivered' : 'Sorted at Hub'}`;
    if (type === 'VEHICLE') return `Engine Health Check - ${i % 2 === 0 ? 'Passed' : 'Attention Required'}`;
    return `Route ${100 + i} path recalculated due to traffic`;
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.dt?.filterGlobal(query, 'contains');
  }

  exportCSV() {
    this.dt?.exportCSV();
  }

  constructor(private router: Router) {}

  navigateToEntity(entityType: string, entityId: string) {
    const pathMap: { [key: string]: string } = {
      'SHIPMENT': '/shipments/detail',
      'VEHICLE': '/vehicles/detail',
      'ROUTE': '/routes/analysis'
    };
    const targetPath = pathMap[entityType];
    if (targetPath) this.router.navigate([targetPath, entityId]);
  }

  getEntityIcon(type: string): string {
    switch(type) {
      case 'SHIPMENT': return 'pi-box';
      case 'VEHICLE': return 'pi-truck';
      case 'ROUTE': return 'pi-map-marker';
      default: return 'pi-info-circle';
    }
  }

  getSeverityTag(severity: string): string {
    switch(severity) {
      case 'danger': return 'cancelled';
      case 'warning': return 'booked';
      case 'info': return 'transit';
      default: return 'booked';
    }
  }
}