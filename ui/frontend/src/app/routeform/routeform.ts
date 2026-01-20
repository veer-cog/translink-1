import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Ensure FormsModule is imported
import { Route } from '../route-plans/route-plans';

@Component({
  selector: 'app-route-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './routeform.html',
  styleUrl: './routeform.scss'
})
export class RouteFormComponent implements OnInit {
  @Input() routeData: Route | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<any>();

  // Form Fields
  vehicleId: string = '';
  stops: any[] = [];
  departureTime: string = '';
  goal: string = 'Shortest Distance';
  draggedItemIndex: number | null = null;

  ngOnInit() {
    if (this.routeData) {
      // If editing, fill the form
      this.vehicleId = this.routeData.vehicleId;
      // Map stops to a format the form can handle
      this.stops = this.routeData.stops.map(s => ({ city: s.city, state: s.state, type: s.type }));
    } else {
      // Default empty stops for a new route
      this.stops = [
        { city: '', state: '', type: 'start' },
        { city: '', state: '', type: 'end' }
      ];
    }
  }

  addStop() {
    // Insert new stop before the 'end' stop
    const newStop = { city: '', state: '', type: 'stop' };
    this.stops.splice(this.stops.length - 1, 0, newStop);
  }

  submitForm() {
    const payload = {
      vehicleId: this.vehicleId,
      stops: this.stops,
      goal: this.goal
    };
    this.submitted.emit(payload);
  }

  closeModal() {
    this.close.emit();
  }

  onDragStart(index: number) {
  // We only allow dragging if it's a 'stop' type
  if (this.stops[index].type === 'stop') {
    this.draggedItemIndex = index;
  }
}

onDrop(targetIndex: number) {
  // Prevent dropping on Start (0) or End (last) or if nothing was dragged
  if (this.draggedItemIndex === null || targetIndex === 0 || targetIndex === this.stops.length - 1) {
    return;
  }

  // 1. Remove the dragged item from its current position
  const movedItem = this.stops.splice(this.draggedItemIndex, 1)[0];

  // 2. Insert it into the new position
  this.stops.splice(targetIndex, 0, movedItem);

  // 3. Reset
  this.draggedItemIndex = null;
}

onCancel() {
  // Reset stops to default empty state
  this.stops = [
    { city: '', state: '', type: 'start' },
    { city: '', state: '', type: 'end' }
  ];
  this.vehicleId = '';
  // Close the modal
  this.closeModal();
}

optimizeAndSubmit() {
  // 1. Keep Start and End fixed
  const start = this.stops[0];
  const end = this.stops[this.stops.length - 1];

  // 2. Get the middle stops and sort them alphabetically by City
  // (In a real app, this is where you'd call a distance calculation)
  const middleStops = this.stops.slice(1, -1).sort((a, b) => {
    return a.city.localeCompare(b.city);
  });

  // 3. Reconstruct the array
  this.stops = [start, ...middleStops, end];

  // 4. Send the data to the parent component
  this.submitForm();
}
}