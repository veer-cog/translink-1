import { Component, EventEmitter, Output, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-book-shipment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Select],
  templateUrl: './book-shipmen.component.html',
  styleUrl: './book-shipmen.component.scss'
})
export class BookShipmenComponent {
  @Input() vehicles: any[] = []; // Used for lookup only
  @Input() routes: any[] = [];
  @Input() hubs: any[] = [];
  @Output() onSave = new EventEmitter<any>();

  isVisible = signal(false);
  shipmentForm: FormGroup;
  formValue = signal<any>({});

  constructor(private fb: FormBuilder) {
    this.shipmentForm = this.fb.group({
      clientName: ['', Validators.required],
      clientNumber: ['', Validators.required],
      originHubId: ['', Validators.required],
      destinationHubId: ['', Validators.required],
      routeId: ['', Validators.required], // Selected by user
      vehicleId: [null, Validators.required], // Hidden/Auto-filled
      revenue: [0, [Validators.required, Validators.min(0)]],
      totalWeight: [0, [Validators.required, Validators.min(0)]],
      description: ['']
    });

    this.shipmentForm.valueChanges.subscribe(val => {
      this.formValue.set(val);
    });
  }

  // Filter routes based on Hub names found in the "stops" string
  validRoutes = computed(() => {
    const originId = this.formValue().originHubId;
    const destId = this.formValue().destinationHubId;

    if (!originId || !destId || this.routes.length === 0) return [];

    const originHub = this.hubs.find(h => h.id === originId);
    const destHub = this.hubs.find(h => h.id === destId);

    if (!originHub || !destHub) return [];

    return this.routes.filter(route => {
      const stops = route.stops || '';
      return stops.includes(originHub.hubName) && stops.includes(destHub.hubName);
    });
  });

  // Triggered when a Route is selected
  onRouteSelect(event: any) {
    const selectedRouteId = event.value;
    const routeData = this.routes.find(r => r.id === selectedRouteId);
    
    if (routeData && routeData.vehicleID) {
      console.log(`🚛 Auto-assigning Vehicle ID: ${routeData.vehicleID} from Route ${selectedRouteId}`);
      this.shipmentForm.patchValue({ vehicleId: routeData.vehicleID });
    } else {
      console.warn("⚠️ Selected route has no pre-assigned vehicleID");
      this.shipmentForm.patchValue({ vehicleId: null });
    }
  }

  show() { this.isVisible.set(true); }
  hide() { 
    this.isVisible.set(false); 
    this.shipmentForm.reset({ revenue: 0, totalWeight: 0 }); 
  }

  submit() {
    if (this.shipmentForm.valid) {
      const raw = this.shipmentForm.value;
      const payload = {
        ...raw,
        vehicleId: Number(raw.vehicleId), // Ensures it matches your backend Long
        revenue: Number(raw.revenue),
        totalWeight: Number(raw.totalWeight)
      };
      this.onSave.emit(payload);
      this.hide();
    }
  }
}