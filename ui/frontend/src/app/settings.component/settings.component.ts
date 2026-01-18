import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';

// PrimeNG
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TabFilterComponent } from "../shareable/components/tab-filter.component/tab-filter.component";
import { Password } from "primeng/password";

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, SelectModule,
    InputTextModule, ButtonModule, ToggleSwitchModule, TextareaModule, ToastModule,
    TabFilterComponent,
    Password
],
  providers: [MessageService],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  activeTab = signal<string>('Profile');
  tabs = ['Profile', 'Security', 'Notifications', 'Organization'];

  countries = [
    { name: 'United States', code: 'US', currency: 'USD ($)' },
    { name: 'United Kingdom', code: 'GB', currency: 'GBP (£)' },
    { name: 'India', code: 'IN', currency: 'INR (₹)' },
    { name: 'Germany', code: 'DE', currency: 'EUR (€)' }
  ];
  selectedCountry: any = this.countries[0];

  // Forms
  profileForm = new FormGroup({
    firstName: new FormControl('John'),
    lastName: new FormControl('Williams'),
    phone: new FormControl('+1 (555) 012-3456'),
    bio: new FormControl('Senior Fleet Manager.')
  });

  notificationForm = new FormGroup({
    criticalFailures: new FormControl(true),
    maintenanceReminders: new FormControl(true),
    emailAlerts: new FormControl(true)
  });

  orgForm = new FormGroup({
    companyName: new FormControl('Fleet Logistics Ltd'),
    country: new FormControl(this.countries[0])
  });

  // Check if current active form is modified
// Inside your class
isSaveDisabled(): boolean {
  const active = this.activeTab();
  
  // A form is "pristine" if it hasn't been changed by the user
  if (active === 'Profile') return this.profileForm.pristine;
  if (active === 'Notifications') return this.notificationForm.pristine;
  if (active === 'Organization') return this.orgForm.pristine;
  
  return true;
}

saveData() {
  // Your API call here...
  this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Settings saved' });
  
  // IMPORTANT: After saving, mark the forms as pristine again to disable the button
  this.profileForm.markAsPristine();
  this.notificationForm.markAsPristine();
  this.orgForm.markAsPristine();
}
  constructor(private messageService: MessageService) {}

  onTabChange(tab: string) { this.activeTab.set(tab); }


}