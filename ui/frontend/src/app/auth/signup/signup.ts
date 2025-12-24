import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';

// PrimeNG imports same as before...
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputOtpModule } from 'primeng/inputotp';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.html',
    styleUrls: ['./signup.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, ButtonModule, ToastModule, MessageModule, CardModule, PasswordModule, FloatLabelModule, InputOtpModule, RouterLink],
    providers: [MessageService]
})
export class Signup {
    private fb = inject(FormBuilder);
    private messageService = inject(MessageService);
    private router = inject(Router);

    signupForm: FormGroup;
    formSubmitted = false;
    showOtp = false;
    otpValue: string = '';
    mockOtp = '123456';

    constructor() {
        this.signupForm = this.fb.group({
            fullName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, { validators: this.passwordMatchValidator });
    }

    // Custom Validator for real-time password matching
    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');
        return password && confirmPassword && password.value !== confirmPassword.value 
            ? { mismatch: true } : null;
    }

    onSignupSubmit() {
        this.formSubmitted = true;
        if (this.signupForm.valid) {
            this.messageService.add({ severity: 'info', summary: 'Success', detail: 'OTP sent to email.' });
            this.showOtp = true;
        }
    }

    verifyOtp() {
        if (this.otpValue === this.mockOtp) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Account Registered!' });
            setTimeout(() => this.router.navigate(['/login']), 2000);
        } else {
            this.messageService.add({ severity: 'error', summary: 'Invalid', detail: 'Code must be 123456' });
        }
    }

    resendOtp() {
        this.messageService.add({ severity: 'info', detail: 'New code sent.' });
    }

    isInvalid(controlName: string) {
        const control = this.signupForm.get(controlName);
        return control?.invalid && (control.touched || this.formSubmitted);
    }
}