import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
import { UserService, UserResponse } from '../services/user.service';

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
export class UserManagementComponent implements OnInit {
  private router = inject(Router);
  private messageService = inject(MessageService);
  private userService = inject(UserService);

  isLoading = signal<boolean>(false);
  userData = signal<any[]>([]); // Changed to any to support mapped fields
  searchQuery = signal<string>('');
  roleFilter = signal<string>('all');
  displayDialog = signal<boolean>(false);
  isEditMode = signal<boolean>(false);

  roleOptions = [{ label: 'Operator', value: 'OPERATOR' }, { label: 'Admin', value: 'ADMIN' }];
  filterOptions = [{ label: 'All Roles', value: 'all' }, { label: 'Admin', value: 'ADMIN' }, { label: 'Operator', value: 'OPERATOR' }];

  userForm = new FormGroup({
    userId: new FormControl(''),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    role: new FormControl('OPERATOR', { nonNullable: true, validators: [Validators.required] }),
    active: new FormControl(true, { nonNullable: true })
  });

  // Updated field names to match the mapped data below
  cols: TableColumn[] = [
    { field: 'id', header: 'User ID' }, // Matches u.id from backend
    { field: 'fullName', header: 'Full Name' }, // Matches our merged fullName
    { field: 'email', header: 'Email Address' },
    { field: 'role', header: 'Role', type: 'badge' },
    { field: 'status', header: 'Status', type: 'badge' },
    { field: 'actions', header: 'Actions', type: 'action' }
  ];

  ngOnInit() {
    this.loadUsers();
  }

loadUsers() {
  this.isLoading.set(true);
  this.userService.getUsers().subscribe({
    next: (users) => {
      const mapped = users.map(u => ({
        ...u,
        // 1. FIX: Correct the status logic (Active if true/1)
        status: u.active ? 'Active' : 'Inactive',

        // 2. FIX: Merge names from backend DTO (firstName + lastName)
        // Backend uses firstName/lastName
        fullName: `${u.firstName || ''} ${u.lastName || ''}`.trim(),

        // 3. FIX: Ensure id is accessible for the table
        // Backend uses 'id'
        displayId: u.id 
      }));
      this.userData.set(mapped);
      this.isLoading.set(false);
    },
    error: (err) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load users' });
      this.isLoading.set(false);
    }
  });
}

  filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const role = this.roleFilter().toLowerCase();
    return this.userData().filter(u => 
      // Searching against the merged fullName and the correct id field
      (u.fullName.toLowerCase().includes(query) || u.id.toLowerCase().includes(query)) &&
      (role === 'all' || u.role.toLowerCase() === role)
    );
  });

  stats = computed(() => [
    { label: 'Total Users', value: this.userData().length, icon: 'pi pi-users', color: '#64748b' },
    { label: 'Active', value: this.userData().filter(u => u.active).length, icon: 'pi pi-check-circle', color: '#22c55e' },
    { label: 'Inactive', value: this.userData().filter(u => !u.active).length, icon: 'pi pi-times-circle', color: '#ef4444' },
    { label: 'Active Operators', value: this.userData().filter(u => u.role === 'OPERATOR' && u.active).length, icon: 'pi pi-shield', color: '#2563eb' }
  ]);

  viewUserDetails(user: any) {
    // Navigating using the correct backend ID
    this.router.navigate(['/admin/users/details/', user.id]);
  }

  openAddModal() {
    this.isEditMode.set(false);
    this.userForm.reset({ role: 'OPERATOR', active: true });
    this.displayDialog.set(true);
  }

  editUser(user: any) {
    this.isEditMode.set(true);
    this.userForm.patchValue({
      userId: user.id,
      name: user.fullName,
      email: user.email,
      role: user.role,
      active: user.active
    });
    this.displayDialog.set(true);
  }

  saveUser() {
    if (this.userForm.invalid) return;
    const val = this.userForm.getRawValue();
    
    if (this.isEditMode()) {
      this.messageService.add({ severity: 'warn', summary: 'Notice', detail: 'Edit functionality depends on profile update logic.' });
    } else {
      this.userService.createOperator(val).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Operator added successfully' });
          this.loadUsers();
          this.displayDialog.set(false);
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Creation failed' });
        }
      });
    }
  }
}