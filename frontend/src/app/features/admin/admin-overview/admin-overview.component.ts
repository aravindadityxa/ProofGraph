import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { User, UserStatus } from '../../../shared/models/user.model';

@Component({
  selector: 'app-admin-overview',
  templateUrl: './admin-overview.component.html',
  styleUrls: ['./admin-overview.component.scss']
})
export class AdminOverviewComponent implements OnInit {
  users: User[] = [];
  loading = true;

  totalUsers = 0;
  totalRecords = 0;
  verifiedRecords = 0;
  pendingRecords = 0;
  activeUsers = 0;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.loading = true;
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.calculateStatistics();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
        this.loading = false;
      }
    });
  }

  calculateStatistics(): void {
    this.totalUsers = this.users.length;
    this.activeUsers = this.users.filter(u => u.status === UserStatus.ACTIVE).length;
    this.totalRecords = this.users.reduce((sum, u) => sum + (u.recordCount || 0), 0);
    this.verifiedRecords = this.users.reduce((sum, u) => sum + (u.verifiedCount || 0), 0);
    this.pendingRecords = this.users.reduce((sum, u) => sum + (u.pendingCount || 0), 0);
  }
}
