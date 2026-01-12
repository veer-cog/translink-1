import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { TabsModule } from 'primeng/tabs';
import { AccordionModule } from 'primeng/accordion';
  import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { RouterLink } from "@angular/router";
import {TagModule} from 'primeng/tag';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { Card } from "primeng/card";
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule, MenubarModule, ButtonModule, CarouselModule,
    TabsModule, AccordionModule, AvatarModule, BadgeModule,
    RouterLink, TagModule, InputGroupModule, InputGroupAddonModule,
    IconField,
    InputIcon,
    Card
],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  darkmode: boolean = false;
  features: any[] = [];
  members: any[] = [];
  responsiveOptions = [
    { breakpoint: '1199px', numVisible: 3, numScroll: 1 },
    { breakpoint: '767px', numVisible: 1, numScroll: 1 }
  ];
shipmentId = '';
  ngOnInit() {
    this.features = [
      { title: 'Fleet & Vehicle Ops', description: 'Register vehicles, monitor maintenance schedules, and manage asset lifecycle within your logistical network.', icon: 'pi pi-truck' },
      { title: 'Booking & Live Tracking', description: 'Create new shipment orders and provide real-time GPS visibility from pickup to final destination.', icon: 'pi pi-map-marker' },
      { title: 'Dispatch & Routing', description: 'Reduce fuel costs and delivery times using AI-driven route planning and automated driver assignments.', icon: 'pi pi-directions' },
      { title: 'Delivery Compliance', description: 'Monitor Proof of Delivery (PoD), driver safety scores, and ensure adherence to regional transport regulations.', icon: 'pi pi-verified' },
      { title: 'Reporting & Insights', description: 'Visualize delivery KPIs, analyze regional performance, and export detailed operational reports for stakeholders.', icon: 'pi pi-chart-line' },
    ];

    this.members = [
      { name: 'Hemani Bollineni', image: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', bio: 'Yet to be Added.' },
      { name: 'Veer Patwa', image: 'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png', bio: 'Yet to be Added.' },
      { name: 'Janhavi Salunkhe', image: 'https://primefaces.org/cdn/primeng/images/demo/avatar/ionibowcher.png', bio: 'Yet to be Added.' },
      { name: 'Alishana Thorat', image: 'https://primefaces.org/cdn/primeng/images/demo/avatar/ionibowcher.png', bio: 'Yet to be Added.' }
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