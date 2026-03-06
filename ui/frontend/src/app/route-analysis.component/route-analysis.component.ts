import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TimelineModule } from 'primeng/timeline';
import { RouteService } from '../services/route.service'; // Ensure correct service name
import { forkJoin, of, switchMap, catchError, finalize, tap } from 'rxjs';

@Component({
  selector: 'app-route-analysis',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, TableModule, TimelineModule],
  templateUrl: './route-analysis.component.html',
  styleUrl: './route-analysis.component.scss'
})
export class RouteAnalysis implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private routeApiService = inject(RouteService);

  routeId: string | null = null;
  loading: boolean = true;
  routeData: any = null;
  assignedShipments: any[] = [];
  assignedVehicle: any = null;

  ngOnInit() {
    this.routeId = this.route.snapshot.paramMap.get('id');
    if (this.routeId) {
      this.loadAnalysis();
    }
  }

  loadAnalysis() {
  this.loading = true;

  this.routeApiService.getRouteById(this.routeId!).pipe(
    switchMap((route: any) => {
      // 1. Sync local routeData with the stops processing
      this.routeData = this.formatStops(route);
      
      // 2. Identify the vehicle ID from your specific JSON key 'vehicleID'
      const vId = route.vehicleID; 

      return forkJoin({
        shipments: this.routeApiService.getShipmentsByRouteId(this.routeId!)
          .pipe(catchError(() => of([]))),
        // Fetch full vehicle details using that ID
        vehicle: vId 
          ? this.routeApiService.getVehicleById(vId).pipe(catchError(() => of(null)))
          : of(null)
      });
    }),
    catchError(err => {
      console.error("Analysis Stream Error:", err);
      return of({ shipments: [], vehicle: null });
    }),
    finalize(() => this.loading = false)
  ).subscribe(res => {
    this.assignedShipments = res.shipments;
    this.assignedVehicle = res.vehicle; // This should now contain the plateNumber
  });
}

private formatStops(route: any) {
  if (!route || !route.stops) return null;
  const processedRoute = { ...route };

  if (typeof route.stops === 'string') {
    const stopArray = route.stops.split(',');
    const totalStops = stopArray.length;

    processedRoute.stops = stopArray.map((city: string, index: number) => {
      const isLast = index === totalStops - 1;
      
      return {
        city: city.trim(),
        // Assign status 'destination' to the last one, others stay neutral
        status: isLast ? 'destination' : (index === 0 ? 'origin' : 'transit'),
        type: index === 0 ? 'Origin' : (isLast ? 'Destination' : 'Transit Stop')
      };
    });
  }
  return processedRoute;
}

  goBack() {
    this.router.navigate(['/admin/routeopt']);
  }
}