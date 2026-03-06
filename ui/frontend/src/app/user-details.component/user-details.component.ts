import { Component, OnInit, signal, ViewChild, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Table, TableModule, TableLazyLoadEvent } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { AuditService, AuditLog } from '../services/audit.service';
import { UserService, UserResponse } from '../services/user.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, TableModule, InputTextModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  
  // Services
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private auditService = inject(AuditService);
  private userService = inject(UserService);

  // Signals for Reactive UI
  user = signal<UserResponse | null>(null);
  logs = signal<AuditLog[]>([]);
  totalRecords = signal(0);
  loading = signal(false);
  daysJoined = signal(0);
  userId = '';

  ngOnInit() {
    // Get ID from URL, fallback to default for testing
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.fetchUserDetails(this.userId);
  }

  fetchUserDetails(userId:string) {
    // Note: You may need to add a getSpecificUser(id) method to your UserService 
    // or use the 'me' endpoint if viewing own profile.
    this.userService.getUserById(userId).subscribe({
      next: (res) => {
        this.user.set(res);
        if (res.createdAt) {
          const joined = new Date(res.createdAt);
          const diffTime = Math.abs(new Date().getTime() - joined.getTime());
          this.daysJoined.set(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        }
      }
    });
  }

  /**
   * Called by PrimeNG (onLazyLoad) whenever pagination or sorting changes
   */
  loadUserLogs(event: TableLazyLoadEvent) {
    this.loading.set(true);

    const page = (event.first || 0) / (event.rows || 10);
    const size = event.rows || 10;

    this.auditService.getUserLogs(this.userId, page, size).subscribe({
      next: (response: any) => {
        // Your backend returns content inside 'content'
        this.logs.set(response.content || []);
        
        // Handle PagedModel/Page metadata for the paginator
        const total = response.totalElements ?? response.page?.totalElements ?? 0;
        this.totalRecords.set(total);
        
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  goBack() { this.location.back(); }
}