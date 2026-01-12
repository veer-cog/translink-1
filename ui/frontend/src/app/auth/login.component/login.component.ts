import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { AuthService } from '../auth.service';

// Custom Service

@Component({
    selector: 'app-login',
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
        FloatLabelModule,
        IconFieldModule,
        InputIconModule
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    isLoading = signal(false);
    loginForm: FormGroup;
    formSubmitted = false;

    constructor() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }
// Validators.pattern('^[a-zA-z0-9]+@cognizant\\.com')
    /**
     * Handles form submission and delegates authentication logic to the AuthService
     */
    onSubmit() {
        this.formSubmitted = true;
        this.isLoading.set(true);
        if (this.loginForm.valid) {
            // Business logic and role-based redirection are handled in the service
           setTimeout(() => {
        this.authService.validateLogin(this.loginForm.value);
        this.isLoading.set(false);
    }, 1000);
        }
       
    }

    isInvalid(controlName: string): boolean {
        const control = this.loginForm.get(controlName);
        return !!(control?.invalid && (control.touched || this.formSubmitted));
    }
}