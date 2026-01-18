import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputOtpModule } from 'primeng/inputotp';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, CardModule, InputTextModule, PasswordModule, ButtonModule, InputOtpModule, ToastModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss']
})
export class ForgotPassword {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  currentStep: 'otpEmail' | 'otpEntry' | 'resetPassword' = 'otpEmail';
  otpValue = '';
  loading = false;
  
  otpEmailForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  otpResetForm: FormGroup = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.authService.passwordMatchValidator });

  requestOtp() {
    if (this.otpEmailForm.invalid) return;
    this.loading = true;
    this.authService.requestPasswordReset(this.otpEmailForm.value.email).subscribe(() => {
      this.loading = false;
      this.currentStep = 'otpEntry';
    });
  }

  submitOtp() {
    if (this.otpValue.length < 6) return;
    this.loading = true;
    this.authService.verifyOtp(this.otpValue).subscribe((isValid) => {
      this.loading = false;
      if (isValid) this.currentStep = 'resetPassword';
      else this.otpValue = ''; 
    });
  }

  verifyAndReset() {
    if (this.otpResetForm.invalid) return;
    this.loading = true;
    this.authService.resetPassword(this.otpResetForm.value.newPassword).subscribe(() => {
      this.loading = false;
    });
  }

  isInvalid(controlName: string, form: FormGroup): boolean {
    const control = form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  resendOTP(){
    this.authService.resendOtp();
  }
}