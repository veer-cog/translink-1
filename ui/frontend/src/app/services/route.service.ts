import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Route {
  id: string; // UUID from Backend
  vehicleID: string;
  stops: string; // This is the JSON string containing your Lat/Lng path
  totalDistance: number;
  totalDuration: number;
  companyId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private http = inject(HttpClient);
  // Point this to your Gateway or Route Service directly
  private apiUrl = `http://localhost:8080/routes`; 

  /**
   * Fetch all routes
   */
  getRoutes(): Observable<Route[]> {
    return this.http.get<Route[]>(this.apiUrl);
  }

  /**
   * Fetch a specific route
   */
  getRouteById(id: string): Observable<Route> {
    return this.http.get<Route>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new route
   */
  createRoute(route: Route): Observable<Route> {
    return this.http.post<Route>(this.apiUrl, route);
  }
}