import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';

// PrimeNG
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';

// Shared
import { TabFilterComponent } from "../shareable/components/tab-filter.component/tab-filter.component";
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, SelectModule,
    InputTextModule, ButtonModule, ToggleSwitchModule, TextareaModule, 
    ToastModule, TabFilterComponent, PasswordModule
  ],
  providers: [MessageService],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  authService = inject(AuthService);
  private messageService = inject(MessageService);

  activeTab = signal<string>('Profile');
  tabs = ['Profile', 'Security', 'Notifications', 'Organization'];

  countries = [
    { name: 'United States', code: 'US', currency: 'USD ($)' },
    { name: 'United Kingdom', code: 'GB', currency: 'GBP (£)' },
    { name: 'India', code: 'IN', currency: 'INR (₹)' },
    { name: 'Germany', code: 'DE', currency: 'EUR (€)' }
  ];
  selectedCountry: any = this.countries[2]; // Default to India

  // --- FORMS ---
  profileForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    phone: new FormControl('+91 98765 43210'),
    bio: new FormControl('Fleet Logistics Professional')
  });

  notificationForm = new FormGroup({
    criticalFailures: new FormControl(true),
    maintenanceReminders: new FormControl(true),
    emailAlerts: new FormControl(true)
  });

  orgForm = new FormGroup({
    companyName: new FormControl('TransLink Global'),
    country: new FormControl(this.countries[2])
  });

  ngOnInit() {
    // Fill profile from AuthService Signals
    const user = this.authService.currentUser();
    if (user) {
      const nameParts = user.name.split(' ');
      this.profileForm.patchValue({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || ''
      });
    }
  }

  onTabChange(tab: string) { 
    this.activeTab.set(tab); 
  }

  isSaveDisabled(): boolean {
    const active = this.activeTab();
    if (active === 'Profile') return this.profileForm.pristine || this.profileForm.invalid;
    if (active === 'Notifications') return this.notificationForm.pristine;
    if (active === 'Organization') return this.orgForm.pristine;
    return true;
  }

  saveData() {
    // In a real app, you would send this to your backend
    this.messageService.add({ 
      severity: 'success', 
      summary: 'Settings Updated', 
      detail: `${this.activeTab()} changes saved successfully.` 
    });
    
    // Mark as pristine to disable button until next change
    this.profileForm.markAsPristine();
    this.notificationForm.markAsPristine();
    this.orgForm.markAsPristine();
  }
}