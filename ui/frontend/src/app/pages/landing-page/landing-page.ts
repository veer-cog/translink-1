import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, CardModule, MenubarModule, RippleModule],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss'
})
export class Landingpage {
  transportModules = [
    { title: 'Fleet', sub: 'Management', icon: 'pi pi-truck', desc: 'Maintain and monitor your vehicle fleet.' },
    { title: 'Shipments', sub: 'Tracking', icon: 'pi pi-box', desc: 'Real-time booking and visibility.' },
    { title: 'Routes', sub: 'Dispatch', icon: 'pi pi-map', desc: 'AI-driven route planning and dispatch.' },
    { title: 'Performance', sub: 'KPIs', icon: 'pi pi-check-circle', desc: 'Compliance and safety monitoring.' },
    { title: 'Analysis', sub: 'Reporting', icon: 'pi pi-chart-bar', desc: 'Advanced logistics data insights.' }
  ];

  items: MenuItem[] = [
    { label: 'Fleet', icon: 'pi pi-car' },
    { label: 'Shipments', icon: 'pi pi-box' },
    { label: 'Routes', icon: 'pi pi-directions' }
  ];
}