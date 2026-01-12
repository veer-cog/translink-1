import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';
import { MessageService } from 'primeng/api';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { definePreset } from '@primeuix/themes';



const MyFullPurplePreset = definePreset(Aura, {
    semantic: {
        // 1. PRIMARY: The core identity (Purple)
        primary: {
            50: '{purple.50}', 100: '{purple.100}', 200: '{purple.200}', 300: '{purple.300}',
            400: '{purple.400}', 500: '{purple.500}', 600: '{purple.600}', 700: '{purple.700}',
            800: '{purple.800}', 900: '{purple.900}', 950: '{purple.950}'
        },

        // 2. SURFACE: The "Grays" (Backgrounds, Borders, Cards)
        // Using 'slate' gives it a modern, cool-toned professional look
        surface: {
            0: '#ffffff', 50: '{slate.50}', 100: '{slate.100}', 200: '{slate.200}', 
            300: '{slate.300}', 400: '{slate.400}', 500: '{slate.500}', 600: '{slate.600}', 
            700: '{slate.700}', 800: '{slate.800}', 900: '{slate.900}', 950: '{slate.950}'
        },

        colorScheme: {
            light: {
                // Primary Action Styles
                primary: {
                    color: '{primary.600}',
                    contrastColor: '#ffffff',
                    hoverColor: '{primary.700}',
                    activeColor: '{primary.800}'
                },
                // ACCENT/HIGHLIGHT (Selections, active states in lists)
                highlight: {
                    background: '{primary.50}',
                    focusBackground: '{primary.100}',
                    color: '{primary.700}',
                    focusColor: '{primary.800}'
                },
                // SECONDARY (Buttons, subtle borders)
                secondary: {
                    background: '{surface.200}',
                    color: '{surface.700}',
                    hoverBackground: '{surface.300}'
                }
            },
            dark: {
                primary: {
                    color: '{primary.400}',
                    contrastColor: '{surface.950}',
                    hoverColor: '{primary.300}',
                    activeColor: '{primary.200}'
                },
                highlight: {
                    background: 'rgba(168, 85, 247, 0.16)', 
                    focusBackground: 'rgba(168, 85, 247, 0.24)',
                    color: 'rgba(255,255,255,.87)',
                    focusColor: 'rgba(255,255,255,.87)'
                }
            }
        },

        // 3. COMMON COMPONENT SEMANTICS
        // This ensures all inputs and buttons feel consistent without custom CSS
        formField: {
            paddingX: '0.75rem',
            paddingY: '0.75rem',
            borderRadius: '8px',
            focusRing: {
                width: '2px',
                style: 'solid',
                color: '{primary.500}',
                offset: '2px'
            }
        },
        
        overlay: {
            borderRadius: '12px',
            shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        },

        navigation: {
            item: {
                borderRadius: '8px'
            }
        }
    }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),// CRITICAL: PrimeNG needs this for dropdowns/toasts
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
        providePrimeNG({
        theme: {
            preset: MyFullPurplePreset,
            options: {
                darkModeSelector: '.p-dark'
            }
        }
    }), MessageService
  ]
};
