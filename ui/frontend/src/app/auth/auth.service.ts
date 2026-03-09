import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

export type UserRole = 'ADMIN' | 'OPERATOR' | null;

export interface DecodedToken {
  sub: string;
  role: UserRole;
  companyId: string;
  userId: string;
  exp: number;
}

export interface LoginResponse {
  status: 'SUCCESS' | 'MFA_REQUIRED' | 'MUST_RESET_PASSWORD';
  token?: string;
  email?: string;
}

export interface AuthResponse {
  token?: string;
  message?: string;
  status?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private http = inject(HttpClient);
  public messageService = inject(MessageService);

  private readonly API_BASE = 'http://localhost:8080/auth';

  // --- STATE ---
  currentUser = signal<{ 
    email: string; 
    role: UserRole; 
    companyId?: string; 
    userId?: string;
    name?: string; 
  } | null>(null);

  public showOtp$ = new BehaviorSubject<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.restoreSession();
    }
  }

  // --- AUTH METHODS ---

  validateLogin(credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_BASE}/login`, credentials).pipe(
      tap((res: LoginResponse) => {
        if (res.status === 'SUCCESS' && res.token) {
          this.handleAuthSuccess(res.token);
        } else if (res.status === 'MFA_REQUIRED') {
          this.showOtp$.next(true); 
        } else if (res.status === 'MUST_RESET_PASSWORD') {
          this.router.navigate(['/auth/reset-password'], { 
            queryParams: { email: res.email, type: 'forced' } 
          });
        }
      })
    );
  }

  verifyOtp(email: string, code: string, purpose: 'LOGIN_MFA' | 'REGISTRATION' | 'PASSWORD_RESET'): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_BASE}/verify-otp`, { email, code, purpose }).pipe(
      tap((res: AuthResponse) => {
        if (res.token && (purpose === 'LOGIN_MFA' || purpose === 'REGISTRATION')) {
          this.showOtp$.next(false);
          this.handleAuthSuccess(res.token);
        }
      })
    );
  }

  signup(formData: any): Observable<string> {
    return this.http.post(`${this.API_BASE}/register`, formData, { responseType: 'text' });
  }

  resendOtp(email: string, purpose: string): Observable<string> {
    return this.http.post(`${this.API_BASE}/resend-otp`, { email, purpose }, { responseType: 'text' });
  }

  initiateForgotPassword(email: string): Observable<string> {
    return this.http.post(`${this.API_BASE}/forgot-password`, { email }, { responseType: 'text' });
  }

  resetPassword(email: string, newPassword: string): Observable<string> {
    return this.http.post(`${this.API_BASE}/reset-password`, { email, newPassword }, { responseType: 'text' });
  }

  changePassword(payload: any): Observable<string> {
    return this.http.post(`${this.API_BASE}/change-password`, payload, { responseType: 'text' });
  }

  // --- SESSION LOGIC (FIXED ACCESS MODIFIERS) ---

  /**
   * Changed to public so it can be accessed by the constructor or other components
   */
  public restoreSession() {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = this.decodeAndSetUser(token);
      if (decoded && decoded.exp * 1000 < Date.now()) {
        this.logout();
      }
    }
  }

  public handleAuthSuccess(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      
      localStorage.setItem('token', token);
    }
    const decoded = this.decodeAndSetUser(token);
    if (decoded) {
      const targetRoute = decoded.role === 'ADMIN' ? '/admin/dashboard' : '/operator/dashboard';
      this.router.navigate([targetRoute]);
    }
  }

  private decodeAndSetUser(token: string): DecodedToken | null {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      this.currentUser.set({
        email: decoded.sub,
        role: decoded.role,
        companyId: decoded.companyId,
        userId: decoded.userId,
        name: decoded.sub.split('@')[0]
      });
      return decoded;
    } catch (e) {
      this.logout();
      return null;
    }
  }

  public logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.currentUser.set(null);
    this.showOtp$.next(false);
    this.router.navigate(['/login']);
  }

  // --- VALIDATORS ---

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password') || control.get('newPassword');
    const confirm = control.get('confirmPassword');
    return password && confirm && password.value !== confirm.value ? { mismatch: true } : null;
  }
}