import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { TimelineModule } from 'primeng/timeline';

@Component({
  selector: 'app-route-analysis',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, TagModule, TableModule, TimelineModule],
  templateUrl: './route-analysis.component.html',
  styleUrl: './route-analysis.component.scss'
})
export class RouteAnalysis implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  routeId: string | null = null;
shipmentCols = [
    { field: 'id', header: 'Shipment ID' },
    { field: 'customer', header: 'Customer' },
    { field: 'weight', header: 'Weight' },
    { field: 'priority', header: 'Priority' }
  ];
  // Mock Data mimicking your Shipment/Vehicle detail structure
  routeDetail = {
    id: 'RT-001',
    status: 'In-Progress',
    vehicleId: 'TRK-101',
    driver: 'Robert Fox',
    totalDistance: '285 miles',
    estTime: '6h 30m',
    efficiency: '94%',
    cost: '$142.00',
    stops: [
      { city: 'New York', state: 'NY', type: 'Pickup', time: '08:00 AM', status: 'Completed' },
      { city: 'Philadelphia', state: 'PA', type: 'Delivery', time: '11:30 AM', status: 'Arrived' },
      { city: 'Baltimore', state: 'MD', type: 'Pickup', time: '02:45 PM', status: 'Pending' },
      { city: 'Washington', state: 'DC', type: 'Final', time: '05:00 PM', status: 'Pending' }
    ],
    shipments: [
      { id: 'SHP-1002', customer: 'Amazon', weight: '120kg', priority: 'High' },
      { id: 'SHP-1005', customer: 'Walmart', weight: '450kg', priority: 'Medium' },
      { id: 'SHP-1009', customer: 'Target', weight: '85kg', priority: 'Low' }
    ]
  };

  ngOnInit() {
    this.routeId = this.route.snapshot.paramMap.get('id');
  }

  goBack() {
    this.router.navigate(['/admin/routes']);
  }
}