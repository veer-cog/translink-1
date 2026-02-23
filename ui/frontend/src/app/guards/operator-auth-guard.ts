import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { MessageService } from 'primeng/api';

export const operatorGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);

  const user = authService.currentUser();

  // 1. Check if user is logged in
  // 2. Check if the role is 'OPERATOR' or 'ADMIN' 
  // (Note: Often Admins are allowed to see Operator views, 
  // but if you want strict isolation, keep it as user.role === 'OPERATOR')
  if (user && (user.role === 'OPERATOR' || user.role === 'ADMIN')) {
    return true;
  }

  // Log for debugging purposes
  console.warn('Unauthorized Access Attempt:', user);

  // If not authorized, show error and redirect
  messageService.add({ 
    severity: 'warn', 
    summary: 'Restricted Access', 
    detail: 'This section is reserved for Fleet Operators.' 
  });
  
  // Parse URL to redirect back to login or a safe page
  return router.parseUrl('/login');
};