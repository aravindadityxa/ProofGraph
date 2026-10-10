import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RecordsService } from '../../../core/services/records.service';
import { Record, RecordStatus } from '../../models/record.model';

interface EngineStage {
  name: string;
  label: string;
  completed: boolean;
  active: boolean;
}

@Component({
  selector: 'app-verification-engine',
  templateUrl: './verification-engine.component.html',
  styleUrls: ['./verification-engine.component.scss']
})
export class VerificationEngineComponent implements OnInit {
  @Input() userId!: string;
  @Output() recordsLoaded = new EventEmitter<Record[]>();
  @Output() error = new EventEmitter<string>();

  stages: EngineStage[] = [
    { name: 'authenticate', label: 'AUTHENTICATE', completed: false, active: false },
    { name: 'fetch', label: 'FETCH RECORDS', completed: false, active: false },
    { name: 'validate', label: 'VALIDATE', completed: false, active: false },
    { name: 'ready', label: 'READY', completed: false, active: false }
  ];

  loading = false;
  completed = false;
  startTime = 0;
  elapsedTime = 0;
  requestDelay = 3000;
  intervalId: any;

  records: Record[] = [];
  verifiedCount = 0;
  pendingCount = 0;

  constructor(private recordsService: RecordsService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.fetchRecords();
    }, 500);
  }

  fetchRecords(): void {
    if (!this.userId) return;

    this.loading = true;
    this.completed = false;
    this.startTime = Date.now();
    this.elapsedTime = 0;
    this.resetStages();

    this.intervalId = setInterval(() => {
      this.elapsedTime = (Date.now() - this.startTime) / 1000;
    }, 100);

    setTimeout(() => this.progressStage(0), 300);
    setTimeout(() => this.progressStage(1), 800);

    this.recordsService.getUserRecords(this.userId, this.requestDelay).subscribe({
      next: (records) => {
        clearInterval(this.intervalId);
        this.elapsedTime = (Date.now() - this.startTime) / 1000;

        setTimeout(() => this.progressStage(2), 100);
        setTimeout(() => {
          this.progressStage(3);
          this.completeVerification(records);
        }, 500);
      },
      error: (err) => {
        clearInterval(this.intervalId);
        this.loading = false;
        this.error.emit(err.error?.message || 'Failed to fetch records');
      }
    });
  }

  resetStages(): void {
    this.stages.forEach(stage => {
      stage.completed = false;
      stage.active = false;
    });
  }

  progressStage(index: number): void {
    if (index > 0) {
      this.stages[index - 1].active = false;
      this.stages[index - 1].completed = true;
    }
    if (index < this.stages.length) {
      this.stages[index].active = true;
    }
  }

  completeVerification(records: Record[]): void {
    this.loading = false;
    this.completed = true;
    this.records = records;

    this.verifiedCount = records.filter(r => r.status === RecordStatus.VERIFIED).length;
    this.pendingCount = records.filter(r => r.status === RecordStatus.PENDING).length;

    this.recordsLoaded.emit(records);
  }

  getStageIcon(stage: EngineStage): string {
    if (stage.completed) return '✓';
    if (stage.active) return '●';
    return '○';
  }

  getStageClass(stage: EngineStage): string {
    if (stage.completed) return 'completed';
    if (stage.active) return 'active';
    return 'pending';
  }
}
