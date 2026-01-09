import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputOtpModule } from 'primeng/inputotp';
import { ToastModule } from 'primeng/toast';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, RouterModule,
    CardModule, FloatLabelModule, InputTextModule, PasswordModule, 
    ButtonModule, InputOtpModule, ToastModule
  ],
  providers: [],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  // Expose the service to the template
  constructor(public auth: AuthService) {}

  // Helper for UI validation messages
  isInvalid(controlName: string, form: FormGroup): boolean {
    const control = form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}