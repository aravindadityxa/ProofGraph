import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AdminService } from '../../core/services/admin.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  currentUser: User | null = null;
  activeView = 'overview';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;

    if (!this.currentUser || !this.authService.isAdmin()) {
      this.router.navigate(['/dashboard']);
    }
  }

  setActiveView(view: string): void {
    this.activeView = view;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
