import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { TabFilterComponent } from "../shareable/components/tab-filter.component/tab-filter.component";
import { UserService, UserResponse } from '../services/user.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, SelectModule,
    InputTextModule, ButtonModule, ToggleSwitchModule, 
    ToastModule, TabFilterComponent, PasswordModule
  ],
  providers: [MessageService],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  userProfile = signal<UserResponse | null>(null);
  activeTab = signal<string>('Profile');
  tabs = ['Profile', 'Security', 'Organization']; // Removed Notifications for brevity
  isLoading = signal<boolean>(false);

  profileForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl({ value: '', disabled: true })
  });

  securityForm = new FormGroup({
    mfaEnabled: new FormControl(false),
    currentPassword: new FormControl(''),
    newPassword: new FormControl(''),
    confirmPassword: new FormControl('')
  });

  orgForm = new FormGroup({
    companyName: new FormControl({ value: '', disabled: true })
  });

  ngOnInit() {
    this.refreshProfile();
  }

  refreshProfile() {
    this.isLoading.set(true);
    this.userService.getMe().subscribe({
      next: (user) => {
        this.userProfile.set(user);
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        });
        this.securityForm.patchValue({ mfaEnabled: user.mfaEnabled });
        this.orgForm.patchValue({ companyName: user.companyName });
        this.isLoading.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load profile' });
        this.isLoading.set(false);
      }
    });
  }

  onTabChange(tab: string) { this.activeTab.set(tab); }

  isSaveDisabled(): boolean {
    const active = this.activeTab();
    if (active === 'Profile') return this.profileForm.pristine || this.profileForm.invalid;
    if (active === 'Security') return this.securityForm.pristine;
    return true;
  }

 saveData() {
  const active = this.activeTab();

  if (active === 'Profile') {
    // Option A: Extract values safely to satisfy the 'UpdateUserRequest' interface
    const payload = {
      firstName: this.profileForm.value.firstName ?? '',
      lastName: this.profileForm.value.lastName ?? ''
    };

    this.userService.updateProfile(payload).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Profile saved' });
        this.userProfile.set(res);
        this.profileForm.markAsPristine();
      },
      error: (err) => this.messageService.add({ severity: 'error', detail: err.error?.message || 'Update failed' })
    });
  } 

    
    else if (active === 'Security') {
      // 1. Handle MFA Toggle
      if (this.securityForm.get('mfaEnabled')?.dirty) {
        const enabled = this.securityForm.value.mfaEnabled!;
        this.userService.toggleMfa(enabled).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', detail: `MFA ${enabled ? 'Enabled' : 'Disabled'}` });
            this.securityForm.get('mfaEnabled')?.markAsPristine();
          }
        });
      }

      // 2. Handle Password Change
      const { currentPassword, newPassword, confirmPassword } = this.securityForm.value;
      if (currentPassword && newPassword) {
        if (newPassword !== confirmPassword) {
          this.messageService.add({ severity: 'error', detail: 'New passwords do not match' });
          return;
        }
        this.authService.changePassword({ currentPassword, newPassword }).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', detail: 'Password changed successfully' });
            this.securityForm.patchValue({ currentPassword: '', newPassword: '', confirmPassword: '' });
          },
          error: (err) => this.messageService.add({ severity: 'error', detail: err.error || 'Password change failed' })
        });
      }
    }
  }
}