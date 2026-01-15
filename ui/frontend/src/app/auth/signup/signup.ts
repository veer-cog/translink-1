import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../auth.service';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { InputOtpModule } from 'primeng/inputotp';
// import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.html',
    styleUrls: ['./signup.scss'],
    standalone: true,
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule, RouterLink,
        InputTextModule, ButtonModule, ToastModule, CardModule, 
        PasswordModule, InputOtpModule, SelectModule, CheckboxModule
    ],
    providers: [MessageService]
})
export class Signup implements OnInit {
    public auth = inject(AuthService);
    private fb = inject(FormBuilder);
    
    signupForm!: FormGroup;
    otpForm!: FormGroup;
    loading: boolean = false;

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
        }, { validators: this.passwordMatchValidator });

        this.otpForm = this.fb.group({
            otpCode: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('password')?.value === g.get('confirmPassword')?.value
            ? null : { mismatch: true };
    }

    isInvalid(controlName: string): boolean {
        const control = this.signupForm.get(controlName);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }

    onSignupSubmit() {
        if (this.signupForm.invalid) {
            this.signupForm.markAllAsTouched();
            return;
        }
        this.loading = true;
        // Simulate API Call
        setTimeout(() => {
            this.loading = false;
            this.auth.showOtp.next(true); 
        }, 1000);
    }

    onOtpSubmit() {
        if (this.otpForm.invalid) return;
        this.loading = true;
        // Call your verification service here
        console.log("Verifying OTP:", this.otpForm.value.otpCode);
    }

    backToSignup() {
        this.auth.showOtp.next(false);
    }
}