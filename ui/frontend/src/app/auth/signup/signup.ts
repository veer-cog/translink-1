import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { InputOtpModule } from 'primeng/inputotp';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink, 
    InputTextModule, 
    ButtonModule, 
    ToastModule, 
    CardModule, 
    PasswordModule, 
    InputOtpModule, 
    CheckboxModule
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup implements OnInit {
  public auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private router = inject(Router);

  signupForm!: FormGroup;
  otpForm!: FormGroup;
  loading = false;
  formSubmitted = false;

  ngOnInit() {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      companyName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      agreeToTerms: [false, Validators.requiredTrue]
    }, { validators: this.auth.passwordMatchValidator });

    this.otpForm = this.fb.group({
      otpCode: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSignupSubmit() {
    this.formSubmitted = true;
    if (this.signupForm.invalid) return;
    
    this.loading = true;
    this.auth.signup(this.signupForm.value).subscribe({
      next: (response: string) => {
        this.loading = false;
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Account Created', 
          detail: response || 'Please check your email for the OTP.' 
        });
        // Transition to OTP view
        this.auth.showOtp$.next(true);
      },
      error: (err) => {
        this.loading = false;
        const errorMsg = err.error?.message || err.error || 'Registration failed';
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: errorMsg 
        });
      }
    });
  }

  onOtpSubmit() {
    if (this.otpForm.invalid) return;
    
    this.loading = true;
    const email = this.signupForm.get('email')?.value;
    const code = this.otpForm.get('otpCode')?.value;
    
    // Purpose 'REGISTRATION' triggers user.setActive(true) in Java Backend
    this.auth.verifyOtp(email, code, 'REGISTRATION').subscribe({
      next: (res) => {
        this.loading = false;
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Email Verified', 
          detail: 'Your account is now active! Redirecting to login...' 
        });
        
        // Hide OTP input and clear form
        this.auth.showOtp$.next(false);
        
        // Delay to let the user read the success message
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        const errorMsg = err.error?.message || 'Invalid or Expired OTP';
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Verification Failed', 
          detail: errorMsg 
        });
      }
    });
  }

  resendOtp() {
  const email = this.signupForm.get('email')?.value;
  if (!email) return;

  this.auth.resendOtp(email, 'REGISTRATION').subscribe({
    // Explicitly type 'msg' as string and 'err' as any
    next: (msg: string) => this.messageService.add({ 
      severity: 'info', 
      summary: 'Resent', 
      detail: msg || 'OTP resent to your email' 
    }),
    error: (err: any) => this.messageService.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: err.error?.message || 'Failed to resend OTP' 
    })
  });
}

  isInvalid(controlName: string): boolean {
    const control = this.signupForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched || this.formSubmitted));
  }

  backToSignup() {
    this.auth.showOtp$.next(false);
  }
}