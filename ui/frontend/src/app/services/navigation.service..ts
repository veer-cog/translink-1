import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  // Signal to manage the open/close state
  sidebarVisible = signal(false);

  toggle() {
    this.sidebarVisible.update(v => !v);
  }

  open() {
    this.sidebarVisible.set(true);
  }

  close() {
    this.sidebarVisible.set(false);
  }
}