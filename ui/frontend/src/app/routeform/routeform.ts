import { Component, Output, EventEmitter, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouteApiService } from '../services/route'; 
import { Route } from '../route-plans/route-plans';

@Component({
  selector: 'app-route-form',
  standalone: true,
  imports: [CommonModule, FormsModule, CommonModule], 
  templateUrl: './routeform.html',
  styleUrl: './routeform.scss'
})
export class RouteFormComponent implements OnInit {
  private apiService = inject(RouteApiService);

  @Input() routeData: Route | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<any>();

  // --- Form State ---
  vehicleId: string = ''; // Stores the Number Plate string
  vehicles: any[] = [];   
  hubs: any[] = [];
  stops: any[] = [];      
  isLoading: boolean = false;
  draggedItemIndex: number | null = null;

  // ngOnInit() {
  //   // 1. Immediately fetch vehicles and hubs on load
  //   this.loadVehicles();
  //   this.loadHubs();

  //   if (this.routeData) {
  //     this.vehicleId = this.routeData.vehicleID; 
  //     this.stops = JSON.parse(JSON.stringify(this.routeData.stops));
  //   } else {
  //     this.stops = [
  //       { city: '', type: 'start' },
  //       { city: '', type: 'end' }
  //     ];
  //   }
  // }
  ngOnInit() {
  this.loadVehicles();
  this.loadHubs();

  if (this.routeData) {
    this.vehicleId = this.routeData.vehicleID; 
    
    // CHANGE: Convert "Port A, Port B" string into the Array format the form uses
    if (typeof this.routeData.stops === 'string') {
      this.stops = this.routeData.stops.split(',').map((name, index, array) => {
        let type = 'stop';
        if (index === 0) type = 'start';
        else if (index === array.length - 1) type = 'end';
        
        return { city: name.trim(), type: type };
      });
    }
  } else {
    this.stops = [
      { city: '', type: 'start' },
      { city: '', type: 'end' }
    ];
  }
}
  loadVehicles() {
    console.log("Attempting to fetch vehicles...");
    this.apiService.getAvailableVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
        console.log("VEHICLES ARRIVED:", this.vehicles);
      },
      error: (err) => {
        console.error("HTTP Error fetching vehicles:", err);
      }
    });
  }

  loadHubs() {
    this.apiService.getAllHubs().subscribe({
      next: (data) => this.hubs = data,
      error: (err) => console.error("Could not load hubs for dropdown", err)
    });
  }

  addStop() {
    const newStop = { city: '', type: 'stop' };
    this.stops.splice(this.stops.length - 1, 0, newStop);
  }

  removeStop(index: number) {
    this.stops.splice(index, 1);
  }

  optimizeAndSubmit() {
    if (!this.vehicleId) {
      alert("Please select a vehicle.");
      return;
    }

    const stopNames = this.stops
      .map(s => s.city)
      .filter(city => city && city.trim().length > 0);

    if (stopNames.length < 2) {
      alert("Please provide at least a Start and End city.");
      return;
    }

    const payload = {
      id: this.routeData?.id,
      vehicleId: this.vehicleId, // String Plate
      stopNames: stopNames
    };

    //added
   const request = this.routeData?.id 
    ? this.apiService.updateRoute(this.routeData.id, payload) 
    : this.apiService.createRoute(payload);

    this.isLoading = true;
    
  request.subscribe({
    next: (savedRouteDTO) => {
      this.isLoading = false;
      this.submitted.emit(savedRouteDTO);
      this.closeModal();
    },
    error: (err) => {
      this.isLoading = false;
      alert("Saving failed.");
    }
  });



    // this.apiService.createRoute(payload).subscribe({
    //   next: (savedRouteDTO) => {
    //     this.isLoading = false;
    //     this.submitted.emit(savedRouteDTO);
    //     this.closeModal();
    //   },
    //   error: (err) => {
    //     this.isLoading = false;
    //     console.error("Save Error:", err);
    //     alert("Optimization failed.");
    //   }
    // });
  }

  closeModal() { this.close.emit(); }
  onCancel() { this.closeModal(); }

  onDragStart(index: number) { 
    if (this.stops[index].type === 'stop') this.draggedItemIndex = index; 
  }

  onDrop(targetIndex: number) {
    if (this.draggedItemIndex === null || targetIndex === 0 || targetIndex === this.stops.length - 1) return;
    const movedItem = this.stops.splice(this.draggedItemIndex, 1)[0];
    this.stops.splice(targetIndex, 0, movedItem);
    this.draggedItemIndex = null;
  }

  insertStopAt(index: number) {
  this.stops.splice(index, 0, { city: '', type: 'stop' });
}
}