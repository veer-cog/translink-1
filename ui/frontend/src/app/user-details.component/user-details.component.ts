import { Component, OnInit, signal, ViewChild, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, TableModule, InputTextModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  
  user = signal<any>(null);
  allLogs = signal<any[]>([]);
  daysJoined =signal(0);
  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('userId') || 'OP-7721';
    
    this.user.set({
      userId: userId,
      name: 'Sarah Miller',
      email: 'sarah.m@translink.com',
      role: 'Operations Lead',
      status: 'Active',
      joinedDate: new Date('2024-05-12'),
      region: 'North America',
      clearance: 'Level 4'
    });

    const joined = new Date(this.user().joinedDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - joined.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  this.daysJoined.set(diffDays);

    this.generateData();
  }

  generateData() {
    const types = ['SHIPMENT', 'VEHICLE', 'ROUTE'];
    const actions = ['Validated Manifest', 'Updated GPS Path', 'Logged Maintenance', 'Assigned Load'];
    
    const logs = Array.from({ length: 25 }).map((_, i) => {
      const type = types[i % 3];
      return {
        id: 100 + i,
        timestamp: new Date(2026, 0, 30, 10, i * 8),
        entityType: type,
        entityId: `${type.substring(0, 3)}-${8000 + i}`,
        action: actions[Math.floor(Math.random() * actions.length)],
        details: `System check verified. Latency: 24ms.`,
        severity: i % 10 === 0 ? 'warning' : 'info'
      };
    });

    this.allLogs.set(logs);
  }

  onSearch(event: Event) {
    this.dt?.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  goBack() { this.location.back(); }
}