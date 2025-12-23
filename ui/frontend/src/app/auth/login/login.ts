// import { Component } from '@angular/core'; 
// import { FormBuilder, FormGroup, Validators } from '@angular/forms'; 
// import { CommonModule } from '@angular/common'; 
// import { ReactiveFormsModule } from '@angular/forms';
// import { RouterLink } from '@angular/router';
// import { InputNumberModule } from 'primeng/inputnumber';
// import { InputTextModule } from 'primeng/inputtext';
// import { FloatLabelModule } from 'primeng/floatlabel';
// import { CardModule } from 'primeng/card';
// import { PasswordModule } from 'primeng/password';
// import { ButtonModule } from 'primeng/button';

// @Component({
//   selector: 'app-login',
//   imports: [RouterLink,
//      PasswordModule,  
//     CommonModule,CardModule,ButtonModule, ReactiveFormsModule,InputTextModule,InputNumberModule,FloatLabelModule],
//   templateUrl: './login.html',
//   styleUrl: './login.scss',
// })
// export class Login {
//   value2='';
//   loginForm: FormGroup;
//   errorMessage = '';

//   constructor(private fb: FormBuilder) {
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', Validators.required]
//     });
//   }

//   onLogin() {
//     if (this.loginForm.invalid) {
//       this.errorMessage = 'Please fill all fields correctly';
//       return;
//     }
//     console.log('Login with', this.loginForm.value);
//     // Call backend API here
//   }

// }
// /*
// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './login.component.html'
// })
// export class LoginComponent {
// }

// */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';

import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    ButtonModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  email = '';
  password = '';
  rememberMe = false;
  constructor(
    private messageService: MessageService,
    private router: Router
  ) {}
  login(): void {
    if (this.email === 'admin@gmail.com' && this.password === 'admin@1234') {
      this.success('Welcome Admin');
    } else if (this.email === 'manager@mail.com' && this.password === 'manager@1234') {
      this.success('Welcome Manager');
    } else if (this.email === 'client@gmail.com' && this.password === 'client@1234') {
      this.success('Welcome Client');
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Login Failed',
        detail: 'Invalid email or password'
      });
    }
  }
  private success(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Login Successful',
      detail: message
    });
  }
}