import { Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { InputOtpModule } from 'primeng/inputotp';
import { AuthService } from '../auth.service';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink, InputTextModule, 
    ButtonModule, ToastModule, CardModule, PasswordModule, 
    CheckboxModule, InputOtpModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login implements OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  
  isLoading = signal(false);
  showOtp$ = this.authService.showOtp$; 
  formSubmitted = false;
  
  // Timer for Resend OTP
  resendCountdown = signal(0);
  private timerSub?: Subscription;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false]
  });

  otpForm: FormGroup = this.fb.group({
    otpCode: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.authService.validateLogin(this.loginForm.value).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          if (res.status === 'MFA_REQUIRED') {
            this.startResendTimer();
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          const detail = err.error?.message || 'Invalid credentials';
          this.authService.messageService.add({ severity: 'error', summary: 'Error', detail });
        }
      });
    }
  }

  submitOtp() {
    if (this.otpForm.invalid) return;
    this.isLoading.set(true);

    const email = this.loginForm.get('email')?.value;
    const code = this.otpForm.get('otpCode')?.value;

    this.authService.verifyOtp(email, code,"LOGIN_MFA").subscribe({
      next: () => this.isLoading.set(false),
      error: (err) => {
        this.isLoading.set(false);
        const detail = err.error?.message || 'Invalid OTP';
        this.authService.messageService.add({ severity: 'error', summary: 'MFA Error', detail });
      }
    });
  }

  resendOtp() {
    if (this.resendCountdown() > 0) return;
    const email = this.loginForm.get('email')?.value;
    
    this.authService.resendOtp(email, 'LOGIN_MFA').subscribe({
      next: () => {
        this.authService.messageService.add({ severity: 'info', summary: 'Sent', detail: 'A new code has been sent.' });
        this.startResendTimer();
      }
    });
  }

  startResendTimer() {
    this.resendCountdown.set(60);
    this.timerSub?.unsubscribe();
    this.timerSub = timer(0, 1000).subscribe(() => {
      if (this.resendCountdown() > 0) {
        this.resendCountdown.update(v => v - 1);
      } else {
        this.timerSub?.unsubscribe();
      }
    });
  }

  cancelOtp() {
    this.authService.showOtp$.next(false);
    this.otpForm.reset();
  }

  isInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(control?.invalid && (control.touched || this.formSubmitted));
  }

  ngOnDestroy() {
    this.timerSub?.unsubscribe();
  }
}