import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HubApiService } from '../../../services/hub-api.service';

@Component({
  selector: 'app-add-vehicle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-vehicle.component.html',
  styleUrl: './add-vehicle.component.scss',
})


export class AddVehicleComponent {
  private hubService = inject(HubApiService);
  hubs = signal<any[]>([]);
  vehicleForm: FormGroup;
  visible = false;
  isEditMode = false;

  @Output() onSave = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {
    this.vehicleForm = this.fb.group({
      id: [null], // Added hidden ID for updates
      vehicleId: ['', Validators.required], 
      type: ['Heavy Truck', Validators.required],
      capacity: ['', [Validators.required, Validators.pattern("^[0-9.]*$")]], // Numerical check
      location: [null, Validators.required], // This will store the Hub ID
      status: ['Active', Validators.required],
      driver: ['', Validators.required]
    });
  }

  show(data?: any) {
  this.hubService.getAllHubs().subscribe(res => {
    this.hubs.set(res);
  });

  if (data) {
    this.isEditMode = true;
    this.vehicleForm.patchValue({
      id: data.id,
      vehicleId: data.vehicleId, 
      type: data.type,
      // Strip unit " Tons" if present to keep the input numeric
      capacity: data.capacity?.toString().replace(/[^0-9.]/g, ''), 
      location: data.hubId, // Use the ID we stored in mapToFrontend
      status: data.status,
      driver: data.driver
    });
  } else {
    this.isEditMode = false;
    this.vehicleForm.reset({ status: 'Active', type: 'Heavy Truck' });
  }
  this.visible = true;
}

  close() { this.visible = false; }

handleSave() {
  if (this.vehicleForm.valid) {
    const formValue = this.vehicleForm.getRawValue();
    
    const payload = {
      id: formValue.id,
      numberPlate: formValue.vehicleId, // Ensure this matches @JsonProperty
      type: formValue.type,
      capacity: parseFloat(formValue.capacity),
      status: formValue.status,
      dvrName: formValue.driver,
      hub: { id: formValue.location } 
    };

    console.log("SENDING PAYLOAD:", payload); // DEBUG: Check numberPlate here
    this.onSave.emit(payload);
    this.close();
  }
}
}