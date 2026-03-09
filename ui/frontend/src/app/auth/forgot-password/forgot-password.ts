import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; 
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputOtpModule } from 'primeng/inputotp';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, CardModule, InputTextModule, PasswordModule, ButtonModule, InputOtpModule, ToastModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss']
})
export class ForgotPassword {

  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router); 

  currentStep: 'otpEmail' | 'otpEntry' | 'resetPassword' = 'otpEmail';
  otpValue = '';
  loading = false; // Controls the UI spinner
  
  otpEmailForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  otpResetForm: FormGroup = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.authService.passwordMatchValidator });

  /**
   * Step 1: Request the OTP
   */
  requestOtp() {
    if (this.otpEmailForm.invalid) return;
    
    this.loading = true; // Start spinner
    const email = this.otpEmailForm.get('email')?.value;

    this.authService.initiateForgotPassword(email).subscribe({
      next: (res) => {
        this.loading = false; // Stop spinner
        this.currentStep = 'otpEntry'; // Move to OTP input screen
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Sent', 
          detail: res || 'OTP sent to your registered email' 
        });
      },
      error: (err) => {
        this.loading = false; // Stop spinner on error
        const errorMsg = err.error?.message || err.error || 'Failed to send OTP';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMsg });
      }
    });
  }

  /**
   * Step 2: Verify the OTP
   */
  submitOtp() {
    if (this.otpValue.length < 6) return;
    
    this.loading = true; // Start spinner
    const email = this.otpEmailForm.get('email')?.value;

    // Purpose must match 'FORGOT_PASSWORD' as required by the backend
    this.authService.verifyOtp(email, this.otpValue, 'PASSWORD_RESET').subscribe({
      next: (res) => {
        this.loading = false; // Stop spinner
        if (res.token) {
          localStorage.setItem('token', res.token); // Store temporary reset token
        }
        this.currentStep = 'resetPassword';
        this.cdr.detectChanges(); // Transition to new password screen
      },
      error: (err) => {
        this.loading = false; // Stop spinner
        const errorMsg = err.error?.message || 'Invalid OTP';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMsg });
      }
    });
  }

  /**
   * Step 3: Final Password Reset
   */
  verifyAndReset() {
    if (this.otpResetForm.invalid) return;
    
    this.loading = true; // Start spinner
    const email = this.otpEmailForm.get('email')?.value;
    const newPwd = this.otpResetForm.value.newPassword;

    this.authService.resetPassword(email, newPwd).subscribe({
      next: (res) => {
        this.loading = false; // Stop spinner
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: res || 'Password reset successfully' 
        });
        // Redirect to login after success
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.loading = false; // Stop spinner
        const errorMsg = err.error?.message || 'Reset failed. Please try again';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMsg });
      }
    });
  }

  /**
   * Handle Resend OTP without advancing the step
   */
  resendOTP() {
    const email = this.otpEmailForm.get('email')?.value;
    if (!email) return;
    
    this.loading = true; // Added: Prevent further clicks during resend
    this.authService.resendOtp(email, 'PASSWORD_RESET').subscribe({
      next: (res: string) => {
        this.loading = false; // Stop spinner
        this.messageService.add({ 
          severity: 'info', 
          summary: 'Resent', 
          detail: res || 'OTP resent to your email' 
        });
        this.currentStep = 'otpEntry';
        this.cdr.detectChanges(); // Ensure user stays on the OTP screen
      },
      error: (err: any) => {
        this.loading = false; // Stop spinner
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: err.error?.message || 'Failed to resend' 
        });
      }
    });
  }

  isInvalid(controlName: string, form: FormGroup): boolean {
    const control = form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}