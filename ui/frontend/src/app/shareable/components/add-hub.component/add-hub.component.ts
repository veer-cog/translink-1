import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-hub',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-backdrop" *ngIf="visible()">
      <div class="modal-card">
        <div class="modal-header">
          <h2>Register New Hub / Port</h2>
          <button class="close-x" (click)="close()">&times;</button>
        </div>
        
        <form [formGroup]="hubForm" (ngSubmit)="submit()">
          <div class="form-field">
            <label>Hub Name</label>
            <input formControlName="hubName" placeholder="e.g., Central Logistics Hub">
          </div>
          
          <div class="form-field">
            <label>City / Location</label>
            <input formControlName="location" placeholder="e.g., Mumbai, Maharashtra">
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" (click)="close()">Cancel</button>
            <button type="submit" [disabled]="hubForm.invalid" class="add-btn-vibrant">
              <i class="pi pi-check"></i>
              <span>Save Hub</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1100; backdrop-filter: blur(4px); }
    .modal-card { background: white; padding: 1.5rem; border-radius: 16px; width: 450px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .modal-header h2 { margin: 0; font-size: 1.25rem; color: #1e293b; }
    .close-x { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b; }
    .form-field { margin-bottom: 1.25rem; }
    .form-field label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #475569; }
    .form-field input { width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; transition: border-color 0.2s; }
    .form-field input:focus { border-color: #2563eb; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 2rem; border-top: 1px solid #f1f5f9; pt: 1.25rem; }
    .btn-cancel { padding: 0.75rem 1.25rem; border-radius: 8px; border: 1px solid #e2e8f0; background: white; cursor: pointer; font-weight: 500; }
    
    /* Matching your "Add Vehicle" vibrant style */
    .add-btn-vibrant {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .add-btn-vibrant:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); }
    .add-btn-vibrant:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class AddHubComponent {
  @Output() onSave = new EventEmitter<any>();
  visible = signal(false);
  hubForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.hubForm = this.fb.group({
      hubName: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  show() { this.visible.set(true); }
  close() { this.visible.set(false); this.hubForm.reset(); }
  submit() { if (this.hubForm.valid) { this.onSave.emit(this.hubForm.value); this.close(); } }
}