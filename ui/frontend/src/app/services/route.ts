import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Route } from '../route-plans/route-plans';

@Injectable({
  providedIn: 'root'
})
export class RouteApiService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/routes';
  private readonly VEHICLES_URL = 'http://localhost:8080/vehicles';
  private readonly HUBS_URL = 'http://localhost:8080/hubs'

  createRoute(request: any): Observable<any> {
    return this.http.post<any>(this.API_URL, request);
  }

  getRoutes(vehicleId?: string): Observable<Route[]> {
    let params = new HttpParams();
    if (vehicleId) {
      params = params.set('vehicleId', vehicleId);
    }
    return this.http.get<Route[]>(this.API_URL, { params });
  }

  getRouteById(id: string): Observable<Route> {
    return this.http.get<Route>(`${this.API_URL}/${id}`);
  }

  deleteRoute(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  updateRoute(id: string, request: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${id}`, request);
  }

  getAvailableVehicles(): Observable<any[]> {
    console.log("Fetching vehicles from:", this.VEHICLES_URL);
    return this.http.get<any[]>(this.VEHICLES_URL); 
  }

  getVehiclesByHub(hubId: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.VEHICLES_URL}/filter?hubId=${hubId}`);
}
getAllHubs(): Observable<any[]> {
  return this.http.get<any[]>(this.HUBS_URL);
}
}