import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment'; // Use standard env for dev
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class VehicleApi {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private readonly baseUrl = `${environment.apiUrl}/vehicles`;

  

  getVehicles(status?: string): Observable<any[]> {
    let params = new HttpParams();
    if (status && status !== 'all') {
      params = params.set('status', status);
    }

    return this.http.get<any[]>(this.baseUrl, { 
      params
    }).pipe(
      map(vehicles => vehicles.map(v => this.mapToFrontend(v)))
    );
  }

  getVehicleDetails(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`, { 
      
    }).pipe(
      map(v => this.mapToFrontend(v))
    );
  }

getMaintenanceLogs(vehiclePlate: string): Observable<any[]> {
  const params = new HttpParams().set('vehicleID', vehiclePlate);
  
  return this.http.get<any[]>(`${environment.apiUrl}/maintenance`, {
    params
  });
}

  saveVehicle(vehicle: any): Observable<any> {
  // The 'payload' keys must match the Java field names or @JsonProperty names
  const payload = {
    id: vehicle.id || null, 
    numberPlate: vehicle.numberPlate, // Ensure 'vehicleId' from your form maps to 'numberPlate'
    dvrName: vehicle.dvrName,        // Matches 'private String dvrName' in Java
    capacity: parseFloat(vehicle.capacity),
    type: vehicle.type,
    status: vehicle.status || 'Active',
    // Ensure 'location' from form (which is usually a Hub ID) maps to a Hub object
    hub: vehicle.hub && vehicle.hub.id ? { id: Number(vehicle.hub.id) } : null  };

  console.log('Sending Payload:', payload); // Debug: Check this in your browser console
  return this.http.post(this.baseUrl, payload, {  });
}

  deleteVehicle(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { 
    });
  }

 
  private mapToFrontend(v: any) {
    const logs = v.maintenanceLogs || [];
    const latestLog = logs.length > 0 
      ? [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
      : null;

    return {
      id: v.id,
      vehicleId: v.numberPlate, 
      type: v.type,
      capacity: v.capacity ? `${v.capacity} Tons` : 'N/A',
      location: v.hub?.hubName || 'Unassigned',
      driver: v.dvrName,
      nextMaintenance: latestLog ? new Date(latestLog.timestamp).toLocaleDateString() : 'Not Scheduled',
      status: v.status,
      hubId: v.hub?.id 
    };
  }

  

deleteMaintenanceLog(logId: number): Observable<any> {
    const headers = new HttpHeaders({
      'X-Company-Id': this.authService.currentUser()?.companyId || '',
      'X-User-Id': this.authService.currentUser()?.userId || ''
    });

    return this.http.delete(`${environment.apiUrl}/maintenance/${logId}`, { headers });
  }
}