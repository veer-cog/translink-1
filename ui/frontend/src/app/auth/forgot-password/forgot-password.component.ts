import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputOtpModule } from 'primeng/inputotp';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api'; // Import MessageService
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, RouterModule,
    CardModule, FloatLabelModule, InputTextModule, PasswordModule, 
    ButtonModule, InputOtpModule, ToastModule
  ],
  providers: [MessageService], // Provide Service
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  currentStep: 'otpEmail' | 'otpEntry' | 'resetPassword' = 'otpEmail';
  otpValue = '';
  otpLength = 6;
  loading = false;
  
  otpEmailForm: FormGroup;
  otpResetForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private messageService: MessageService // Inject Service
  ) {
    this.otpEmailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpResetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  isInvalid(controlName: string, form: FormGroup): boolean {
    const control = form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  requestOtp() {
    if (this.otpEmailForm.invalid) {
      this.otpEmailForm.markAllAsTouched();
      return;
    }
    
    this.loading = true;
    // Simulate API Call
    setTimeout(() => {
      this.loading = false;
      this.messageService.add({ 
        severity: 'success', 
        summary: 'OTP Sent', 
        detail: `Verification code sent to ${this.otpEmailForm.value.email}` 
      });
      this.currentStep = 'otpEntry';
    }, 1000);
  }

  submitOtp() {
    if (this.otpValue.length !== this.otpLength) {
      this.messageService.add({ severity: 'warn', summary: 'Incomplete', detail: 'Please enter the full 6-digit code.' });
      return;
    }

    this.loading = true;
    
    // MOCK VALIDATION: Let's assume '123456' is the correct OTP for testing
    setTimeout(() => {
        this.loading = false;
        if (this.otpValue === '123456') {
            this.messageService.add({ severity: 'success', summary: 'Verified', detail: 'OTP code accepted.' });
            this.currentStep = 'resetPassword';
        } else {
            // INCORRECT OTP ACTION: Clear input and show error
            this.otpValue = ''; 
            this.messageService.add({ 
                severity: 'error', 
                summary: 'Invalid OTP', 
                detail: 'The code you entered is incorrect. Please try again.' 
            });
        }
    }, 800);
  }

  verifyAndReset() {
    if (this.otpResetForm.invalid) {
      this.otpResetForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    setTimeout(() => {
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password updated successfully.' });
        
        // Redirect after a short delay so they can see the toast
        setTimeout(() => this.router.navigate(['/login']), 1500);
    }, 1000);
  }
  resendOtp() {
          this.messageService.add({ severity: 'info', detail: 'New code sent.' });
      }
  passwordsMatchValidator(group: AbstractControl) {
    const np = group.get('newPassword')?.value;
    const cp = group.get('confirmPassword')?.value;
    return np === cp ? null : { mismatch: true };
  }
}