import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private messageService = inject(MessageService);

  public signupForm: FormGroup;
  public showOtp = new BehaviorSubject<boolean>(false);
  public formSubmitted = false;
  public otpValue: string = '';
  private readonly MOCK_OTP = 'TL1234';

  constructor() {
    this.signupForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value 
      ? { mismatch: true } : null;
  }

  public onSignupSubmit() {
    this.formSubmitted = true;
    if (this.signupForm.valid) {
      this.messageService.add({ severity: 'info', summary: 'Success', detail: 'OTP sent to email.' });
      this.showOtp.next(true);
    }
  }

  public verifyOtp() {
    if (this.otpValue === this.MOCK_OTP) {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Account Registered!' });
      setTimeout(() => this.router.navigate(['/login']), 2000);
    } else {
      this.messageService.add({ severity: 'error', summary: 'Invalid', detail: 'Code must be TL1234' });
    }
  }

  public resendOtp() {
    this.messageService.add({ severity: 'info', detail: 'New code sent.' });
  }

  public isInvalid(controlName: string): boolean {
    const control = this.signupForm.get(controlName);
    return !!(control?.invalid && (control.touched || this.formSubmitted));
  }
}