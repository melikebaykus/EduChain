import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // 🔹 Angular Router (sayfa yönlendirmeleri)
    provideRouter(routes),

    // 🔹 HttpClient (backend ile konuşmak için ZORUNLU)
    provideHttpClient()
  ]
};
