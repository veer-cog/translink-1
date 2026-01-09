import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // State Management
  private stepSubject = new BehaviorSubject<'otpEmail' | 'otpEntry' | 'resetPassword'>('otpEmail');
  currentStep$ = this.stepSubject.asObservable();
  
  loading = false;
  otpValue = '';
  otpEmailForm: FormGroup;
  otpResetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {
    // Initialize Forms in Service
    this.otpEmailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpResetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  // --- Logic Functions ---

  requestOtp() {
    if (this.otpEmailForm.invalid) {
      this.otpEmailForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    // Simulate API
    of(true).pipe(delay(1000)).subscribe(() => {
      this.loading = false;
      this.messageService.add({ 
        severity: 'success', 
        summary: 'OTP Sent', 
        detail: `Sent to ${this.otpEmailForm.value.email}` 
      });
      this.stepSubject.next('otpEntry');
    });
  }

  submitOtp() {
    if (this.otpValue.length !== 6) {
      this.messageService.add({ severity: 'warn', summary: 'Incomplete', detail: 'Enter 6 digits.' });
      return;
    }

    this.loading = true;
    of(this.otpValue === '123456').pipe(delay(800)).subscribe(isValid => {
      this.loading = false;
      if (isValid) {
        this.messageService.add({ severity: 'success', summary: 'Verified' });
        this.stepSubject.next('resetPassword');
      } else {
        this.otpValue = '';
        this.messageService.add({ severity: 'error', summary: 'Invalid OTP' });
      }
    });
  }

  verifyAndReset() {
    if (this.otpResetForm.invalid) {
      this.otpResetForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    of(true).pipe(delay(1000)).subscribe(() => {
      this.loading = false;
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password updated.' });
      setTimeout(() => this.router.navigate(['/login']), 1500);
    });
  }

  private passwordsMatchValidator(group: AbstractControl) {
    const np = group.get('newPassword')?.value;
    const cp = group.get('confirmPassword')?.value;
    return np === cp ? null : { mismatch: true };
  }
}