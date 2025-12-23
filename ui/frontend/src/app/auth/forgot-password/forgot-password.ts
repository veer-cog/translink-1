import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputOtpModule, InputOtpChangeEvent } from 'primeng/inputotp';
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
    RadioButtonModule,
    InputOtpModule
  ],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss']
})

export class ForgotPassword {
  method: 'email' | 'otp' = 'email';
 currentStep: 'choose' | 'emailLink' | 'otpEmail' | 'otpEntry' | 'resetPassword' = 'choose';



  otpValue = '';
  otpLength = 6;
  otpCompleted = false;

  emailForm: FormGroup;
  otpEmailForm: FormGroup;
  otpResetForm: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpEmailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpResetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  // Step navigation
  chooseMethod() 
  { 
    if (this.method === 'email') 
      { 
        this.currentStep = 'emailLink'; // go to email link step 
  } 
  else 
    { 
      this.currentStep = 'otpEmail'; // go to OTP flow
    } }

  sendLink() 
  { 
    if (this.emailForm.invalid) 
      { 
        this.errorMessage = 'Enter a valid email'; 
        return; 
      } 
      this.errorMessage = ''; 
      alert('Reset link sent to your email.'); 
      this.resetFlow();
  }


  requestOtp() {
    if (this.otpEmailForm.invalid) {
      this.errorMessage = 'Enter a valid email';
      return;
    }
    this.errorMessage = '';
    alert('OTP sent to your email.');
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
    alert('OTP verified.');
    this.currentStep = 'resetPassword';
    this.otpResetForm.reset();
  }

  verifyAndReset() {
    if (this.otpResetForm.invalid) {
      this.errorMessage = 'Fill all fields correctly';
      return;
    }
    this.errorMessage = '';
    alert('Password reset successful.');
    this.resetFlow();
  }

  resetFlow() {
    this.currentStep = 'choose';
    this.emailForm.reset();
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
