// // import { Component } from '@angular/core'; 
// // import { FormBuilder, FormGroup, Validators } from '@angular/forms'; 
// // import { CommonModule } from '@angular/common'; 
// // import { ReactiveFormsModule } from '@angular/forms';
// // import { RouterLink } from '@angular/router';
// // import { InputNumberModule } from 'primeng/inputnumber';
// // import { InputTextModule } from 'primeng/inputtext';
// // import { FloatLabelModule } from 'primeng/floatlabel';
// // import { CardModule } from 'primeng/card';
// // import { PasswordModule } from 'primeng/password';
// // import { ButtonModule } from 'primeng/button';

// // @Component({
// //   selector: 'app-login',
// //   imports: [RouterLink,
// //      PasswordModule,  
// //     CommonModule,CardModule,ButtonModule, ReactiveFormsModule,InputTextModule,InputNumberModule,FloatLabelModule],
// //   templateUrl: './login.html',
// //   styleUrl: './login.scss',
// // })
// // export class Login {
// //   value2='';
// //   loginForm: FormGroup;
// //   errorMessage = '';

// //   constructor(private fb: FormBuilder) {
// //     this.loginForm = this.fb.group({
// //       email: ['', [Validators.required, Validators.email]],
// //       password: ['', Validators.required]
// //     });
// //   }

// //   onLogin() {
// //     if (this.loginForm.invalid) {
// //       this.errorMessage = 'Please fill all fields correctly';
// //       return;
// //     }
// //     console.log('Login with', this.loginForm.value);
// //     // Call backend API here
// //   }

// // }
// // /*
// // import { Component } from '@angular/core';
// // import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// // import { CommonModule } from '@angular/common';
// // import { ReactiveFormsModule } from '@angular/forms';

// // @Component({
// //   selector: 'app-login',
// //   standalone: true,
// //   imports: [CommonModule, ReactiveFormsModule],
// //   templateUrl: './login.component.html'
// // })
// // export class LoginComponent {
// // }

// // */

// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { MessageService } from 'primeng/api';
// import { CardModule } from 'primeng/card';
// import { InputTextModule } from 'primeng/inputtext';
// import { PasswordModule } from 'primeng/password';
// import { CheckboxModule } from 'primeng/checkbox';

// import { ButtonModule } from 'primeng/button';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [
//     FormsModule,
//     CardModule,
//     InputTextModule,
//     PasswordModule,
//     CheckboxModule,
//     ButtonModule
//   ],
//   templateUrl: './login.html',
//   styleUrls: ['./login.scss']
// })
// export class Login {
//   email = '';
//   password = '';
//   rememberMe = false;
//   submitted = false;
//   constructor(
//     private messageService: MessageService,
//     private router: Router
//   ) {}
//   login(): void {
//     this.submitted = true;
//     if (!this.email || !this.password) { this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: 'Email and password are required' }); return; }

//     if (this.email === 'admin@gmail.com' && this.password === 'admin@1234') {
//       this.success('Welcome Admin');
//     } else if (this.email === 'manager@mail.com' && this.password === 'manager@1234') {
//       this.success('Welcome Manager');
//     } else if (this.email === 'client@gmail.com' && this.password === 'client@1234') {
//       this.success('Welcome Client');
//     } else {
//       this.messageService.add({
//         severity: 'error',
//         summary: 'Login Failed',
//         detail: 'Invalid email or password'
//       });
//     }
//   }
//   private success(message: string): void {
//     this.messageService.add({
//       severity: 'success',
//       summary: 'Login Successful',
//       detail: message
//     });
//   }
// }

import { Component, inject, } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card'; // Added
import { PasswordModule } from 'primeng/password'; // Added
import { FloatLabelModule } from 'primeng/floatlabel'; // Added
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router ,Routes } from '@angular/router';
import { LandingPage } from '../../pages/landing-page/landing-page';


const routes: Routes = [ 
  { path: 'landing-page', component: LandingPage }, 
  { path: '', redirectTo: '/login', pathMatch: 'full' } ];

;
@Component({
    selector: 'reactive-forms-demo',
    templateUrl: './login.html',
    styleUrls: ['./login.scss'],
    standalone: true,
    imports: [
        InputTextModule,
        ButtonModule,
        ToastModule,
        MessageModule,
        ReactiveFormsModule,
        CardModule,
        PasswordModule,
        FloatLabelModule,
        RouterLink
    ],

    providers: [MessageService]
})

export class Login {
    messageService = inject(MessageService);
    exampleForm: FormGroup;
    formSubmitted = false;
 
    constructor(private fb: FormBuilder,private router:Router) {
        this.exampleForm = this.fb.group({        
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required] // Added
        });
    }
 
    // onSubmit() {
    //     this.formSubmitted = true;
    //     if (this.exampleForm.valid) {
    //         this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login Successful', life: 3000 });
    //         console.log('Login Data:', this.exampleForm.value);
    //         // logic to navigate or call API
    //     }
    // }

  onSubmit() {
  this.formSubmitted = true;

  if (this.exampleForm.invalid) {
    this.messageService.add({
      severity: 'error',
      summary: 'Login Failed',
      detail: 'Please fill all fields correctly',
      life: 3000
    });
    return;
  }

  const { email, password } = this.exampleForm.value;

  if (email === 'admin@gmail.com' && password === 'admin@1234') {
    this.success('Welcome Admin');
    setTimeout(()=>{
      this.router.navigate(['/']);
    },1000);
    
  } else if (email === 'manager@mail.com' && password === 'manager@1234') {
    this.success('Welcome Manager');
    setTimeout(()=>{
      this.router.navigate(['/']);
    },1000);
  } else if (email === 'client@gmail.com' && password === 'client@1234') {
    this.success('Welcome Client');
     setTimeout(()=>{
      this.router.navigate(['/']);
    },1000);
  } else {
    this.messageService.add({
      severity: 'error',
      summary: 'Login Failed',
      detail: 'Invalid email or password',
      life: 3000
    });
    console.log('email',password)
  }
}

private success(message: string): void {
  this.messageService.add({
    severity: 'success',
    summary: 'Login Successful',
    detail: message,
    life: 3000
  });
}

 
    isInvalid(controlName: string) {
        const control = this.exampleForm.get(controlName);
        return control?.invalid && (control.touched || this.formSubmitted);
    }
    // isValid(email:string,password:string){
    //   console.log('all valid')
    // }
}