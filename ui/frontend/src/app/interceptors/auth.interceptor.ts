import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');
    
    // List routes that specifically DO NOT need a token
    const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/verify-otp', '/auth/reset-password'];
    const isPublicRoute = publicRoutes.some(url => req.url.includes(url));

    // If there is a token and it's NOT a public route, attach it
    if (token && !isPublicRoute) {
      const cloned = req.clone({
        setHeaders: { 
            Authorization: `Bearer ${token}` 
        }
      });
      return next(cloned);
    }
  }
  
  return next(req);
};