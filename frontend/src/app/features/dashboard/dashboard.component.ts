import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { RecordsService } from '../../core/services/records.service';
import { User } from '../../shared/models/user.model';
import { Record, RecordCategory, RecordStatus, VerificationStage } from '../../shared/models/record.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  userProfile: User | null = null;
  records: Record[] = [];
  verificationStages: VerificationStage[] = [];
  selectedStage: VerificationStage | null = null;
  loading = true;
  profileLoading = true;
  error = '';

  verifiedCount = 0;
  pendingCount = 0;
  totalCount = 0;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private recordsService: RecordsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadUserProfile();
  }

  loadUserProfile(): void {
    if (!this.currentUser?.id) return;

    this.profileLoading = true;
    this.userService.getUserProfile(this.currentUser.id).subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.profileLoading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.profileLoading = false;
      }
    });
  }

  onRecordsLoaded(records: Record[]): void {
    this.records = records;
    this.loading = false;
    this.calculateStatistics();
    this.buildVerificationStages();
  }

  onRecordsError(error: string): void {
    this.error = error;
    this.loading = false;
  }

  calculateStatistics(): void {
    this.totalCount = this.records.length;
    this.verifiedCount = this.records.filter(r => r.status === RecordStatus.VERIFIED).length;
    this.pendingCount = this.records.filter(r => r.status === RecordStatus.PENDING).length;
  }

  buildVerificationStages(): void {
    const stages: VerificationStage[] = [
      {
        name: 'identity',
        label: 'Identity',
        category: RecordCategory.IDENTITY,
        status: RecordStatus.INCOMPLETE,
        count: 0
      },
      {
        name: 'education',
        label: 'Education',
        category: RecordCategory.EDUCATION,
        status: RecordStatus.INCOMPLETE,
        count: 0
      },
      {
        name: 'experience',
        label: 'Experience',
        category: RecordCategory.EXPERIENCE,
        status: RecordStatus.INCOMPLETE,
        count: 0
      },
      {
        name: 'employment',
        label: 'Employment',
        category: RecordCategory.EMPLOYMENT,
        status: RecordStatus.INCOMPLETE,
        count: 0
      },
      {
        name: 'current',
        label: 'Current',
        category: RecordCategory.CERTIFICATION,
        status: RecordStatus.INCOMPLETE,
        count: 0
      }
    ];

    stages.forEach(stage => {
      const categoryRecords = this.records.filter(r => r.category === stage.category);
      stage.count = categoryRecords.length;

      if (categoryRecords.length === 0) {
        stage.status = RecordStatus.INCOMPLETE;
      } else {
        const hasVerified = categoryRecords.some(r => r.status === RecordStatus.VERIFIED);
        const hasPending = categoryRecords.some(r => r.status === RecordStatus.PENDING);
        
        if (hasVerified) {
          stage.status = RecordStatus.VERIFIED;
        } else if (hasPending) {
          stage.status = RecordStatus.PENDING;
        } else {
          stage.status = RecordStatus.INCOMPLETE;
        }
      }
    });

    this.verificationStages = stages;
    this.selectedStage = stages[0];
  }

  selectStage(stage: VerificationStage): void {
    this.selectedStage = stage;
  }

  getStageRecords(stage: VerificationStage): Record[] {
    return this.records.filter(r => r.category === stage.category);
  }

  getStatusClass(status: RecordStatus): string {
    switch (status) {
      case RecordStatus.VERIFIED:
        return 'status-verified';
      case RecordStatus.PENDING:
        return 'status-pending';
      case RecordStatus.INCOMPLETE:
        return 'status-incomplete';
      default:
        return '';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
