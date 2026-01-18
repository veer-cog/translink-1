import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-vehicle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-vehicle.component.html',
  styleUrl: './add-vehicle.component.scss',
})
export class AddVehicleComponent {
vehicleForm: FormGroup;
  visible = false;
  isEditMode = false;

  @Output() onSave = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {
    this.vehicleForm = this.fb.group({
      vehicleId: ['', Validators.required], // Changed from 'id' to match your table data key
      type: ['Heavy Truck', Validators.required],
      capacity: ['', Validators.required],
      location: ['New York Hub', Validators.required], // Changed from 'hub' to 'location'
      status: ['Active', Validators.required],
      driver: ['', Validators.required],
      nextMaintenance: [''] // Added field to match table requirements
    });
  }

  show(data?: any) {
    if (data) {
      this.isEditMode = true;
      this.vehicleForm.patchValue(data);
    } else {
      this.isEditMode = false;
      this.vehicleForm.reset({ 
        type: 'Heavy Truck', 
        location: 'New York Hub', 
        status: 'Active',
        nextMaintenance: new Date().toISOString().split('T')[0] 
      });
    }
    this.visible = true;
  }

  close() {
    this.visible = false;
  }

  handleSave() {
    if (this.vehicleForm.valid) {
      this.onSave.emit(this.vehicleForm.getRawValue()); // Use getRawValue to include disabled/id fields
      this.close();
    }
  }
}

