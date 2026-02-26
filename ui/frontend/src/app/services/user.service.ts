import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserResponse {
  mfaEnabled: boolean | null | undefined;
  id: string;         // Matches u.getId()
  firstName: string;  // Matches u.getFirstName()
  lastName: string;   // Matches u.getLastName()
  email: string;      // Matches u.getEmail()
  role: string;       // Matches u.getRole()
  active: boolean;  // Matches u.isActive()
  companyName?: string; // Matches u.getCompany().getName()
  createdAt?: string;
  status?: string;    // UI-only derived field
}
export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  // Add other fields if your backend DTO supports them
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private readonly API_BASE = 'http://localhost:8080/users';

  getUsers(): Observable<UserResponse[]> {
    // Maps to @GetMapping("/list") in UserController
    return this.http.get<UserResponse[]>(`${this.API_BASE}/list`);
  }

  createOperator(userData: any): Observable<any> {
    // Maps to @PostMapping("/create-operator") in UserController
    return this.http.post(`${this.API_BASE}/create-operator`, userData);
  }

  getMe(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API_BASE}/me`);
  }

  /**
   * Updates the current user's profile
   * PUT /users/me
   */
  updateProfile(request: UpdateUserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.API_BASE}/me`, request);
  }

  /**
   * Toggles MFA status
   * PUT /users/mfa?enabled=true
   */
  toggleMfa(enabled: boolean): Observable<string> {
    return this.http.put(`${this.API_BASE}/mfa`, null, {
      params: { enabled: enabled.toString() },
      responseType: 'text'
    });
  }
}