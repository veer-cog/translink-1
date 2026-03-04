import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define the interface based on your Shipment.java entity
export interface Shipment {
  id?: number;
  shipmentNumber?: string;
  clientName: string;
  clientNumber: string;
  revenue: number;
  originHubId: string;
  destinationHubId: string;
  vehicleId: number;
  routeId?: string; // Added to support Route Service integration
  status?: string;
  totalWeight: number;
  description: string;
  companyId?: string;
  createdBy?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {
  private http = inject(HttpClient);
  private apiUrl = `http://localhost:8080/shipments`; // e.g., http://localhost:8083/shipments
  private routesUrl = `http://localhost:8080/routes`;
  /**
   * GET all shipments for the logged-in user's company
   */
  getAllShipments(): Observable<Shipment[]> {
    
    return this.http.get<Shipment[]>(this.apiUrl);
  }

  /**
   * GET specific shipment details by ID
   */
 getShipmentById(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Add status update method here if your backend supports it
  updateStatus(id: number | string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status });
  }

  /**
   * POST: Create a new shipment
   */
  createShipment(shipment: Shipment): Observable<any> {
    return this.http.post<any>(this.apiUrl, shipment);
  }

  getRouteById(id: string): Observable<any>{
    return this.http.get<any>(`${this.routesUrl}/${id}`);
  }

  updateShipmentStatus(id: number, status: string): Observable<any> {
  return this.http.patch(`${this.apiUrl}/${id}/status`, { status });
}
}