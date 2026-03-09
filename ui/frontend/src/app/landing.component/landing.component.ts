import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, CarouselModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  features: Feature[] = [];
  responsiveOptions: any[] = [];

  ngOnInit() {
       this.features = [
      { title: 'Fleet & Vehicle Ops', description: 'Register vehicles, monitor maintenance schedules, and manage asset lifecycle within your logistical network.', icon: 'pi pi-truck' },
      { title: 'Booking & Live Tracking', description: 'Create new shipment orders and provide real-time GPS visibility from pickup to final destination.', icon: 'pi pi-map-marker' },
      { title: 'Dispatch & Routing', description: 'Reduce fuel costs and delivery times using AI-driven route planning and automated driver assignments.', icon: 'pi pi-directions' },
      { title: 'Delivery Compliance', description: 'Monitor Proof of Delivery (PoD), driver safety scores, and ensure adherence to regional transport regulations.', icon: 'pi pi-verified' },
      { title: 'Reporting & Insights', description: 'Visualize delivery KPIs, analyze regional performance, and export detailed operational reports for stakeholders.', icon: 'pi pi-chart-line' },
    ];

    this.responsiveOptions = [
      { breakpoint: '1024px', numVisible: 3, numScroll: 3 },
      { breakpoint: '768px', numVisible: 2, numScroll: 2 },
      { breakpoint: '560px', numVisible: 1, numScroll: 1 }
    ];
  }
}