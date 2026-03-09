import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuditLog {
  id: number;
  companyId: string;
  userId: string;
  userEmail: string;
  serviceName: string;
  endpoint: string;
  method: string;
  statusCode: number;
  createdAt: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

@Injectable({ providedIn: 'root' })
export class AuditService {
  // Use a relative path or a proper environment variable to avoid CORS/Port issues
  private readonly baseUrl = 'http://localhost:8080/api/v1/audit';

  constructor(private http: HttpClient) {}

  getLogs(page: number, size: number, sort: string, search?: string, service?: string): Observable<PagedResponse<AuditLog>> {
  let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    .set('sort', sort);

  if (search) params = params.set('search', search);
  if (service) params = params.set('serviceName', service);

  return this.http.get<PagedResponse<AuditLog>>(`${this.baseUrl}/company`, { params });
}

  getUserLogs(userId: string, page: number, size: number): Observable<PagedResponse<AuditLog>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PagedResponse<AuditLog>>(`${this.baseUrl}/user/${userId}`, { params });
  }
}