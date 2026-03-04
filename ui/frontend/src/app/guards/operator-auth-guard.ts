import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

export const operatorGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

    if (isPlatformServer(platformId)) {
    return true; 
  }

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');

    if (token && !authService.currentUser()) {
      authService.restoreSession();
    }

    const role = authService.currentUser()?.role;
    if (role === 'OPERATOR' || role === 'ADMIN') {
      return true;
    }
  }

  return router.parseUrl('/login');
};