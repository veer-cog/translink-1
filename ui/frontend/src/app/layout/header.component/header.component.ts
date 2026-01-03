import { Component, computed, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { AvatarModule } from 'primeng/avatar';
import { Menu, MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple'; 
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-header',
  imports: [ CommonModule, 
    MenubarModule, 
    ButtonModule, 
    InputTextModule, 
    IconFieldModule, 
    InputIconModule, 
    AvatarModule, 
    MenuModule,
    RippleModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  navService = inject(NavigationService);
  authService = inject(AuthService);
  darkmode: boolean = false;
  
  @ViewChild('profileMenu') profileMenu!: Menu;
  
  profileItems: MenuItem[] | undefined;
  user = computed(() => this.authService.currentUser());

  ngOnInit() {
    this.profileItems = [
      { 
        label: 'View Profile', 
        icon: 'pi pi-user',
        command: () => { console.log('Profile clicked'); } 
      },
      { 
        label: 'Settings', 
        icon: 'pi pi-cog',
        command: () => { console.log('Settings clicked'); }  
      },
      { separator: true },
      { 
        label: 'Logout', 
        icon: 'pi pi-sign-out',
        styleClass: 'logout-item',
        // linkClass used in custom #item template
        linkClass: '!text-red-500 dark:!text-red-400',
        command: () => {
          this.authService.logout();
        } 
      }
    ];
  }

  toggleTheme() {
    if (typeof document !== 'undefined') {
      const element = document.documentElement;
      element.classList.toggle('p-dark');
      this.darkmode = element.classList.contains('p-dark');
    }
  }
}