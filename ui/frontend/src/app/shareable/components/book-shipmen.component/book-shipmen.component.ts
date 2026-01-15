import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-book-shipment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" *ngIf="isVisible()">
      <div class="modal-card">
        <div class="modal-header">
          <h2>Book New Shipment</h2>
          <button class="close-btn" (click)="hide()"><i class="pi pi-times"></i></button>
        </div>

        <form [formGroup]="shipmentForm" (ngSubmit)="submit()">
          <div class="form-grid">
            <div class="form-group">
              <label>Customer ID</label>
              <input formControlName="customerId" placeholder="CUST-XXX" />
            </div>
            <div class="form-group">
              <label>Customer Name</label>
              <input formControlName="customerName" placeholder="Company name" />
            </div>
            <div class="form-group">
              <label>Pickup Location</label>
              <input formControlName="pickup" placeholder="City, State" />
            </div>
            <div class="form-group">
              <label>Delivery Location</label>
              <input formControlName="delivery" placeholder="City, State" />
            </div>
            <div class="form-group">
              <label>Weight</label>
              <input formControlName="weight" placeholder="e.g., 5 tons" />
            </div>
            <div class="form-group">
              <label>Priority</label>
              <select formControlName="priority">
                <option value="" disabled>Select priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div class="form-group full-width">
              <label>Assign Vehicle</label>
              <select formControlName="vehicle">
                <option value="" disabled>Select vehicle</option>
                <option value="TRK-101">TRK-101</option>
                <option value="TRK-045">TRK-045</option>
              </select>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" (click)="hide()">Cancel</button>
            <button type="submit" class="btn-submit" [disabled]="shipmentForm.invalid">Book Shipment</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrl: './book-shipmen.component.scss'
})
export class BookShipmenComponent {
  @Output() onSave = new EventEmitter<any>();
  isVisible = signal(false);
  shipmentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.shipmentForm = this.fb.group({
      customerId: ['', Validators.required],
      customerName: ['', Validators.required],
      pickup: ['', Validators.required],
      delivery: ['', Validators.required],
      weight: ['', Validators.required],
      priority: ['', Validators.required],
      vehicle: ['', Validators.required]
    });
  }

  show() { this.isVisible.set(true); }
  hide() { this.isVisible.set(false); this.shipmentForm.reset(); }

  submit() {
    if (this.shipmentForm.valid) {
      this.onSave.emit(this.shipmentForm.value);
      this.hide();
    }
  }
}