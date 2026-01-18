import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { InputOtpModule } from 'primeng/inputotp';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InputTextModule, ButtonModule, ToastModule, CardModule, PasswordModule, InputOtpModule, SelectModule, CheckboxModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup implements OnInit {
  public auth = inject(AuthService);
  private fb = inject(FormBuilder);
  
  signupForm!: FormGroup;
  otpForm!: FormGroup;
  loading = false;

  roles = [
    { label: 'Shipper', value: 'shipper' },
    { label: 'Carrier', value: 'carrier' },
    { label: 'Broker', value: 'broker' }
  ];

  ngOnInit() {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      companyName: ['', Validators.required],
      role: [null, Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      agreeToTerms: [false, Validators.requiredTrue]
    }, { validators: this.auth.passwordMatchValidator });

    this.otpForm = this.fb.group({
      otpCode: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSignupSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.auth.signup(this.signupForm.value).subscribe(() => this.loading = false);
  }

  onOtpSubmit() {
    if (this.otpForm.invalid) return;
    this.loading = true;
    this.auth.verifyOtp(this.otpForm.value.otpCode).subscribe(isValid => {
      this.loading = false;
      if (isValid) {
        this.auth.showOtp$.next(false);
        // Navigate or show final success
      }
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.signupForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  backToSignup() {
    this.auth.showOtp$.next(false);
  }
}