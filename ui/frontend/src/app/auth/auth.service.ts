import { inject, Injectable, signal } from '@angular/core';
import { AbstractControl, ValidationErrors, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export type UserRole = 'ADMIN' | 'OPERATOR' | 'CLIENT' | null;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  // --- MOCK DATA ---
  private readonly MOCK_OTP = '123456';

  // --- STATE MANAGEMENT ---
  currentUser = signal<{ email: string; role: UserRole; name: string } | null>(null);
  public showOtp$ = new BehaviorSubject<boolean>(false);

  // --- HELPER METHODS ---
  private getRedirectPath(role: UserRole): string {
    switch (role) {
      case 'ADMIN': return '/admin/dashboard';
      case 'OPERATOR': return '/operator/dashboard';
      case 'CLIENT': return '/client/dashboard';
      default: return '/login';
    }
  }

  // Shared validator for Signup and Forgot Password
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password') || control.get('newPassword');
    const confirm = control.get('confirmPassword');
    return password && confirm && password.value !== confirm.value ? {  m:true } : null;
  }

  // --- LOGIN FLOW (Role Based) ---
  validateLogin(credentials: any): void {
    const { email, password } = credentials;
    let role: UserRole = null;
    let name = '';

    // Credential check logic
    if (email === 'admin@gmail.com' && password === 'admin@1234') {
      role = 'ADMIN';
      name = 'System Administrator';
    } else if (email === 'manager@gmail.com' && password === 'manager@1234') {
      role = 'OPERATOR';
      name = 'Fleet Manager';
    } else if (email === 'client@gmail.com' && password === 'client@1234') {
      role = 'CLIENT';
      name = 'Logistics Client';
    }

    if (role) {
      this.currentUser.set({ email, role, name });
      this.messageService.add({ severity: 'success', summary: 'Login Successful', detail: `Welcome ${name}` });
      this.router.navigate([this.getRedirectPath(role)]);
    } else {
      this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: 'Invalid credentials' });
    }
  }

  // --- SIGNUP FLOW ---
  signup(formData: any): Observable<boolean> {
    // In a real app, you'd send formData to the server here
    return of(true).pipe(
      delay(1000),
      tap(() => {
        this.messageService.add({ severity: 'info', summary: 'OTP Sent', detail: 'Please check your email.' });
        this.showOtp$.next(true); // Switch signup component to OTP view
      })
    );
  }

  // --- FORGOT PASSWORD & RESET FLOW ---
  requestPasswordReset(email: string): Observable<boolean> {
    return of(true).pipe(
      delay(1000),
      tap(() => {
        this.messageService.add({ severity: 'success', summary: 'OTP Sent', detail: `Code sent to ${email}` });
      })
    );
  }

  verifyOtp(otp: string): Observable<boolean> {
    const isValid = otp === this.MOCK_OTP;
    return of(isValid).pipe(
      delay(800),
      tap((valid) => {
        if (valid) {
          this.messageService.add({ severity: 'success', summary: 'Verified', detail: 'Code accepted.' });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Invalid Code', detail: 'The OTP is incorrect.' });
        }
      })
    );
  }

  resetPassword(password: string): Observable<boolean> {
    return of(true).pipe(
      delay(1000),
      tap(() => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password updated.' });
        this.showOtp$.next(false);
        this.router.navigate(['/login']);
      })
    );
  }

  resendOtp() {
    this.messageService.add({ severity: 'info', summary: 'Resent', detail: 'A new code has been sent.' });
  }

  logout() {
    this.currentUser.set(null);
    this.showOtp$.next(false);
    this.router.navigate(['/login']);
  }
}