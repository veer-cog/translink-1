import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '.././auth.service';

// PrimeNG Imports
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
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    standalone: true,
    imports: [
      CommonModule, FormsModule, ReactiveFormsModule, RouterLink,
      InputTextModule, ButtonModule, ToastModule, MessageModule, 
      CardModule, PasswordModule, FloatLabelModule, InputOtpModule
    ],
    providers: [MessageService] // Required for Toast
})
export class SignupComponent {
    // Inject the service as public so the HTML can access it directly
    public auth = inject(AuthService);
}