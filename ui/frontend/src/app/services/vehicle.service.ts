import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vehicle {
  id: number;
  numberPlate: string;
  status: string;
  type: string; // e.g., 'TRUCK', 'VAN'
  location?: string;
  companyId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private http = inject(HttpClient);
  // Point this to your Gateway or Vehicle Service directly
  private apiUrl = `http://localhost:8080/vehicles`; 

  /**
   * Fetch all vehicles for the current context
   */
  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.apiUrl);
  }

  /**
   * Fetch a single vehicle by ID
   */
  getVehicleById(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.apiUrl}/${id}`);
  }

  /**
   * Save a new vehicle
   */
  createVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.apiUrl, vehicle);
  }
}