import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
<<<<<<< HEAD
import { routes } from './app.routes';
=======
import { MessageService } from 'primeng/api';

>>>>>>> d7ec342e1081a2712d1e818930c7da382b0cd0d3

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
    providePrimeNG({
<<<<<<< HEAD
      theme: {
        preset: Aura
      }
    })
=======
            theme: {
                preset: Aura,
                options: {
            darkModeSelector: true
          }
            }
        }),MessageService,
>>>>>>> d7ec342e1081a2712d1e818930c7da382b0cd0d3
  ]
};