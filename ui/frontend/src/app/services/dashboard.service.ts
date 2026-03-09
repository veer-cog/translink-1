import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/shipments';

  getShipments( page: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard?page=${page}`);
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/stats`);
  }
}