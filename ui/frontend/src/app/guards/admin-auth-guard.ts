import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { MessageService } from 'primeng/api';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);

  const user = authService.currentUser();

  // 1. Check if user is logged in
  // 2. Check if the role is exactly 'ADMIN'
  if (user && user.role === 'ADMIN') {
    return true;
  }

  console.log(user);

  // If not admin, show error and redirect
  messageService.add({ 
    severity: 'error', 
    summary: 'Access Denied', 
    detail: 'You do not have administrative privileges.' 
  });
  
  return router.parseUrl('/login');
};