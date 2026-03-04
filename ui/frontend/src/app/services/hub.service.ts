import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Hub {
  id: string;
  name: string;
  location?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HubService {
  private http = inject(HttpClient);
  private apiUrl = `http://localhost:8080/hubs`; // Adjust port

  getHubs(): Observable<Hub[]> {
    return this.http.get<Hub[]>(this.apiUrl);
  }
}