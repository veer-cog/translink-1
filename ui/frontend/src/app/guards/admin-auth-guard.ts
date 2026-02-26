import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common'; // Add isPlatformServer

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // 1. IF RUNNING ON SERVER:
  // Allow the server to render the page. The browser will perform 
  // the real check once the JS loads and accesses localStorage.
  if (isPlatformServer(platformId)) {
    return true; 
  }

  // 2. IF RUNNING IN BROWSER:
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');
    
    if (token && !authService.currentUser()) {
      authService.restoreSession();
    }

    if (authService.currentUser()?.role === 'ADMIN') {
      return true;
    }
  }

  return router.parseUrl('/login');
};