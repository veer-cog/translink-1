import { CommonModule } from '@angular/common';
import { Component, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-vehicle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-vehicle.component.html',
  styleUrl: './add-vehicle.component.scss',
})
export class AddVehicleComponent {
 isOpen = signal(false); // Signal to control visibility
  vehicleForm: FormGroup;
  onSave = output<any>();

  types = ['Heavy Truck', 'Medium Truck', 'Light Van'];
  locations = ['New York Hub', 'Chicago Hub', 'Boston Hub'];

  constructor(private fb: FormBuilder) {
    this.vehicleForm = this.fb.group({
      id: ['', Validators.required],
      type: ['', Validators.required],
      capacity: ['', Validators.required],
      location: ['', Validators.required],
      driver: ['']
    });
  }

  show() { this.isOpen.set(true); }
  close() { this.isOpen.set(false); }

  save() {
    if (this.vehicleForm.valid) {
      this.onSave.emit(this.vehicleForm.value);
      this.close();
      this.vehicleForm.reset();
    }
  }
}
