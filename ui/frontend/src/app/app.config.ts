import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { definePreset } from '@primeuix/themes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';


ModuleRegistry.registerModules([AllCommunityModule]);
const MyDashboardPreset = definePreset(Aura, {
    semantic: {
        // 1. PRIMARY: Using your Brand Colors
        primary: {
            50: '#eff6ff', 
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#0052cc', // --primary-color
            600: '#0747a6', // --primary-hover
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
            950: '#172554'
        },

        // 2. SURFACE: Using your Background & Border colors
        surface: {
            0: '#ffffff',   // --bg-card
            50: '#f1f5f9',  // --bg-dashboard
            100: '#f1f5f9', 
            200: '#e2e8f0', // --border-color
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b', // --text-muted
            600: '#475569',
            700: '#334155',
            800: '#1e3a5f', // --secondary-bg (Sidebar)
            900: '#1e293b', // --text-main
            950: '#0f172a'
        },

        // 3. GRAY: Direct mapping for general utility
        gray: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
            950: '#020617'
        },

        // 4. STATUS COLORS: Mapping your status variables to semantic roles
        info: {
            background: '#eff6ff', // --status-in-transit
            color: '#3b82f6',      // --status-in-transit-text
        },
        success: {
            background: '#f0fdf4', // --status-delivered
            color: '#22c55e',      // --status-delivered-text
        },
        help: {
            background: '#faf5ff', // --status-booked
            color: '#a855f7',      // --status-booked-text
        },
        warn: {
            background: '#fff7ed', 
            color: '#f97316',
        },

        colorScheme: {
            light: {
                primary: {
                    color: '{primary.500}',
                    contrastColor: '#ffffff',
                    hoverColor: '{primary.600}',
                    activeColor: '{primary.700}'
                },
                highlight: {
                    background: '{primary.50}',
                    focusBackground: '{primary.100}',
                    color: '{primary.600}',
                    focusColor: '{primary.700}'
                },
                text: {
                    color: '#1e293b',       // --text-main
                    mutedColor: '#64748b',  // --text-muted
                },
                content: {
                    background: '#ffffff',  // --bg-card
                    borderColor: '#e2e8f0'  // --border-color
                },
                navigation: {
                    item: {
                        focusBackground: '#1e3a5f',
                        activeBackground: '#0052cc',
                        color: 'rgba(255, 255, 255, 0.8)' // --sidebar-text
                    }
                }
            }
        },

        // 5. GLOBAL CONFIGS
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        formField: {
            borderRadius: '8px'
        }
    }
});
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(
      withFetch(), // Fixes the NG02801 warning
      withInterceptors([authInterceptor]) // Fixes the 401 Unauthorized error
    ),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    providePrimeNG({
      theme: {
        preset: MyDashboardPreset,
        options: {
          darkModeSelector: false
        }
      }
    }),MessageService
  ]
};
