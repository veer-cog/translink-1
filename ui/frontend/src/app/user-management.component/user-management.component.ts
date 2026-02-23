import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Added for redirection
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { GenericTableComponent, TableColumn } from '../shareable/components/generic-table.component/generic-table.component';
import { StatCardComponent } from '../shareable/components/stat-card.component/stat-card.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, GenericTableComponent, 
    StatCardComponent, ToastModule, DialogModule, 
    ButtonModule, InputTextModule, SelectModule, ToggleSwitchModule, FormsModule
  ],
  providers: [MessageService],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {
  private router = inject(Router); // Injecting Router for redirection
  private messageService = inject(MessageService);

  searchQuery = signal<string>('');
  roleFilter = signal<string>('all');
  displayDialog = signal<boolean>(false);
  isEditMode = signal<boolean>(false);

  roleOptions = [{ label: 'Operator', value: 'Operator' }, { label: 'Admin', value: 'Admin' }];
  filterOptions = [{ label: 'All Roles', value: 'all' }, { label: 'Admin', value: 'Admin' }, { label: 'Operator', value: 'Operator' }];

  userForm = new FormGroup({
    userId: new FormControl('', { nonNullable: true }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    role: new FormControl('Operator', { nonNullable: true, validators: [Validators.required] }),
    isActive: new FormControl(true, { nonNullable: true })
  });

  cols: TableColumn[] = [
    { field: 'userId', header: 'User ID' },
    { field: 'name', header: 'Full Name' },
    { field: 'email', header: 'Email Address' },
    { field: 'role', header: 'Role', type: 'badge' },
    { field: 'status', header: 'Status', type: 'badge' },
    { field: 'actions', header: 'Actions', type: 'action' }
  ];

  userData = signal([
    { userId: 'USR-001', name: 'John Admin', email: 'admin@translink.com', role: 'Admin', status: 'Active', isActive: true },
    { userId: 'USR-002', name: 'Sarah Miller', email: 'sarah.m@translink.com', role: 'Operator', status: 'Active', isActive: true },
    { userId: 'USR-003', name: 'Mike Ross', email: 'mike.r@translink.com', role: 'Operator', status: 'Inactive', isActive: false }
  ]);

  filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const role = this.roleFilter().toLowerCase();
    return this.userData().filter(u => 
      (u.name.toLowerCase().includes(query) || u.userId.toLowerCase().includes(query)) &&
      (role === 'all' || u.role.toLowerCase() === role)
    );
  });

  stats = computed(() => [
    { label: 'Total Users', value: this.userData().length, icon: 'pi pi-users', color: '#64748b' },
    { label: 'Active', value: this.userData().filter(u => u.isActive).length, icon: 'pi pi-check-circle', color: '#22c55e' },
    { label: 'Inactive', value: this.userData().filter(u => !u.isActive).length, icon: 'pi pi-times-circle', color: '#ef4444' },
    { label: 'Active Operators', value: this.userData().filter(u => u.role === 'Operator' && u.isActive === true).length, icon: 'pi pi-shield', color: '#2563eb' }
  ]);

  // Redirection function
  viewUserDetails(user: any) {
    this.router.navigate(['/admin/users/details/', user.userId]);
  }

  openAddModal() {
    this.isEditMode.set(false);
    this.userForm.reset({ role: 'Operator', isActive: true });
    this.displayDialog.set(true);
  }

  editUser(user: any) {
    this.isEditMode.set(true);
    this.userForm.patchValue({
      ...user,
      isActive: user.status === 'Active'
    });
    this.displayDialog.set(true);
  }

  saveUser() {
    if (this.userForm.valid) {
      const val = this.userForm.getRawValue();
      const statusString = val.isActive ? 'Active' : 'Inactive';
      
      const userPayload = { 
        ...val, 
        status: statusString,
        isActive: val.isActive 
      };

      if (this.isEditMode()) {
        this.userData.update(users => users.map(u => u.userId === val.userId ? { ...u, ...userPayload } : u));
        this.messageService.add({ severity: 'info', summary: 'Updated', detail: `User set to ${statusString}` });
      } else {
        const newUser = { ...userPayload, userId: `USR-00${this.userData().length + 1}` };
        this.userData.update(users => [newUser, ...users]);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Operator added.' });
      }
      this.displayDialog.set(false);
    }
  }
}