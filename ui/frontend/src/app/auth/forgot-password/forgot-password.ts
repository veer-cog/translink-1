import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputOtpModule, InputOtpChangeEvent } from 'primeng/inputotp';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    FloatLabelModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    InputOtpModule,
    ToastModule
  ],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss'],
  providers: [MessageService]
})
export class ForgotPassword {
  currentStep: 'otpEmail' | 'otpEntry' | 'resetPassword' = 'otpEmail';  // ✅ start directly at email for OTP

  otpValue = '';
  otpLength = 6;
  otpCompleted = false;

  otpEmailForm: FormGroup;
  otpResetForm: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder, private messageService: MessageService, private router: Router) {
    this.otpEmailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpResetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  requestOtp() {
    if (this.otpEmailForm.invalid) {
      this.errorMessage = 'Enter a valid email';
      return;
    }
    this.errorMessage = '';
    this.messageService.add({ severity: 'info', summary: 'OTP Sent', detail: 'OTP sent to your email.' });
    this.currentStep = 'otpEntry';
    this.otpValue = '';
    this.otpCompleted = false;
  }

  onOtpChange(event: InputOtpChangeEvent) {
    this.otpValue = event.value;
    this.otpCompleted = this.otpValue.length === this.otpLength;
  }

  submitOtp() {
    if (!this.otpCompleted) {
      this.errorMessage = 'Enter full OTP';
      return;
    }
    this.errorMessage = '';
    this.messageService.add({ severity: 'success', summary: 'OTP Verified', detail: 'You can now reset your password.' });
    this.currentStep = 'resetPassword';
    this.otpResetForm.reset();
  }

verifyAndReset() {
  if (this.otpResetForm.invalid) {
    this.errorMessage = 'Fill all fields correctly';
    return;
  }
  this.errorMessage = '';
  this.messageService.add({ 
    severity: 'success', 
    summary: 'Password Reset', 
    detail: 'Your password has been reset successfully.' 
  });

  setTimeout(() => {
    this.router.navigate(['/login']);
  }, 1500);
}


  resetFlow() {
    this.currentStep = 'otpEmail';   
    this.otpEmailForm.reset();
    this.otpResetForm.reset();
    this.otpValue = '';
    this.otpCompleted = false;
  }

  passwordsMatchValidator(group: AbstractControl) {
    const np = group.get('newPassword')?.value;
    const cp = group.get('confirmPassword')?.value;
    return np === cp ? null : { mismatch: true };
  }
}
