import { Injectable, inject, signal } from '@angular/core';
import { AbstractControl, ValidationErrors, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

export type UserRole = 'ADMIN' | 'OPERATOR' | 'CLIENT' | null;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private messageService = inject(MessageService);

  currentUser = signal<{ email: string; role: UserRole; name: string } | null>(null);

  /**
   * Helper to determine the correct route based on role
   */
  private getRedirectPath(role: UserRole): string {
    switch (role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'OPERATOR':
        return '/operator/dashboard';
      case 'CLIENT':
        return '/client/dashboard';
      default:
        return '/login';
    }
  }
  validateLogin(credentials: any) {
    const { email, password } = credentials;
    let role: UserRole = null;
    let name = '';

    if (email === 'admin@gmail.com' && password === 'admin@1234') {
      role = 'ADMIN';
      name = 'System Administrator';
    } else if (email === 'manager@gmail.com' && password === 'manager@1234') {
      role = 'OPERATOR'; // Mapping manager email to Operator role per your logic
      name = 'Fleet Manager';
    } else if (email === 'client@gmail.com' && password === 'client@1234') {
      role = 'CLIENT';
      name = 'Logistics Client';
    }

    if (role) {
      this.currentUser.set({ email, role, name });
      this.messageService.add({ severity: 'success', summary: 'Login Successful', detail: `Welcome ${name}`, life: 3000 });
      
      // REDIRECTION LOGIC
      const path = this.getRedirectPath(role);
      this.router.navigate([path]);
    } else {
      this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: 'Invalid credentials', life: 3000 });
    }
  }

  logout() {
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}