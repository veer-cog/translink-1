import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from '../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class HubApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/hubs`;

  getAllHubs(): Observable<any[]> {
    // This calls your HubController @GetMapping
    return this.http.get<any[]>(this.baseUrl);
  }
}