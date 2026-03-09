import { Component, EventEmitter, Output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { environment } from '../environments/environment.prod';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-log-maintenance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-backdrop" *ngIf="isVisible()">
      <div class="modal-content">
        <div class="modal-header">
          <h3><i class="pi pi-wrench"></i> {{ editingLogId() ? 'Edit' : 'Log' }} Maintenance</h3>
          <button class="close-btn" (click)="close()">&times;</button>
        </div>

        <form [formGroup]="mForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <div class="form-group">
              <label>Service Type</label>
              <input type="text" formControlName="serviceType" placeholder="e.g. Oil Change">
            </div>
            <div class="form-group">
              <label>Mechanic Name</label>
              <input type="text" formControlName="mechanicName">
            </div>
            <div class="form-group">
              <label>Cost</label>
              <input type="number" formControlName="cost">
            </div>
            <div class="form-group">
              <label>Status</label>
              <select formControlName="status">
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div class="form-group full-width">
              <label>Description</label>
              <textarea formControlName="description" rows="3"></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-secondary" (click)="close()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="mForm.invalid || isSaving()">
              <i class="pi" [ngClass]="isSaving() ? 'pi-spin pi-spinner' : 'pi-check'"></i>
              {{ isSaving() ? 'Saving...' : 'Save Log' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop { 
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
  background: rgba(15, 23, 42, 0.6); display: flex; 
  align-items: center; justify-content: center; z-index: 2000; 
  backdrop-filter: blur(4px);
}
.modal-content { 
  background: white; padding: 2rem; border-radius: 16px; width: 550px; 
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  animation: modalSlideUp 0.3s ease-out;
}
    .modal-header {
      display: flex; justify-content: space-between; align-items: center;
      h3 { margin: 0; font-size: 1.25rem; color: #0f172a; display: flex; align-items: center; gap: 10px; }
      .close-btn { background: none; border: none; font-size: 1.75rem; color: #94a3b8; cursor: pointer; &:hover { color: #ef4444; } }
    }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin: 1.5rem 0; }
    .full-width { grid-column: span 2; }
    .form-group {
      label { display: block; font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 0.5rem; }
      input, select, textarea { 
        width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem;
        &:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
      }
    }
    .modal-footer {
      display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; padding-top: 1.5rem; border-top: 1px solid #f1f5f9;
      button { 
        height: 44px; padding: 0 1.5rem; border-radius: 10px; font-size: 0.9rem; font-weight: 600; 
        cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px;
      }
      .btn-secondary { background: white; color: #64748b; border: 1px solid #e2e8f0; &:hover { background: #f8fafc; } }
      .btn-primary { 
        background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); color: white; border: none;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        &:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3); }
        &:disabled { background: #cbd5e1; cursor: not-allowed; box-shadow: none; }
      }
    }
  `]
})
export class LogMaintenanceComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  // CHANGED: Now emits an object with action type and data
  @Output() onSave = new EventEmitter<{ action: 'added' | 'updated', data: any }>();

  isVisible = signal(false);
  isSaving = signal(false);
  vehiclePlate = signal<string | null>(null);
  editingLogId = signal<number | null>(null);

  mForm: FormGroup = this.fb.group({
    serviceType: ['', Validators.required],
    mechanicName: ['', Validators.required],
    cost: [0, [Validators.required, Validators.min(0)]],
    status: ['Pending', Validators.required],
    description: ['']
  });

  show(plate: string, logData?: any) {
    this.vehiclePlate.set(plate);
    this.isVisible.set(true);
    if (logData) {
      this.editingLogId.set(logData.id);
      this.mForm.patchValue(logData);
    } else {
      this.editingLogId.set(null);
      this.mForm.reset({ status: 'Pending', cost: 0 });
    }
  }

  onSubmit() {
    if (this.mForm.valid && this.vehiclePlate()) {
      this.isSaving.set(true);
      const headers = new HttpHeaders({
        'X-Company-Id': this.authService.currentUser()?.companyId || '',
        'X-User-Id': this.authService.currentUser()?.userId || ''
      });

      const id = this.editingLogId();
      const isEdit = !!id;

      // Note: Typing the HTTP call as <any> to access the response body
      const request$ = isEdit 
        ? this.http.put<any>(`${environment.apiUrl}/maintenance/${id}`, this.mForm.value, { headers })
        : this.http.post<any>(`${environment.apiUrl}/maintenance`, this.mForm.value, { 
            params: { vehicleID: this.vehiclePlate()! }, headers 
          });

      request$.subscribe({
        next: (res) => {
          // Extract data based on your Spring Boot response structure (Map.of("data", ...))
          const savedData = res.data || res; 
          
          this.onSave.emit({ 
            action: isEdit ? 'updated' : 'added', 
            data: savedData 
          });

          this.isSaving.set(false);
          this.close();
        },
        error: () => {
          this.isSaving.set(false);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save log.' });
        }
      });
    }
  }

  close() { this.isVisible.set(false); }
}