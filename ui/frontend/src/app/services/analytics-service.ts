// src/app/services/analytics-service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/analytics';

  getDashboardData(period: string): Observable<any> {
    const params = new HttpParams().set('period', period);

    return forkJoin({
      summary: this.http.get(`${this.baseUrl}/dashboard/summary`, { params }).pipe(catchError(() => of(null))),
      trends: this.http.get(`${this.baseUrl}/revenue-cost-trend`, { params }).pipe(catchError(() => of([]))),
      costs: this.http.get(`${this.baseUrl}/costs/breakdown`, { params }).pipe(catchError(() => of(null))),
      operations: this.http.get(`${this.baseUrl}/recent-logistics-operations`, { params }).pipe(catchError(() => of([])))
    });
  }
}