import { Component, Input } from '@angular/core';
import { Record, RecordStatus } from '../../models/record.model';

@Component({
  selector: 'app-records-table',
  templateUrl: './records-table.component.html',
  styleUrls: ['./records-table.component.scss']
})
export class RecordsTableComponent {
  @Input() records: Record[] = [];
  @Input() loading = false;
  @Input() error = '';

  getStatusClass(status: RecordStatus): string {
    switch (status) {
      case RecordStatus.VERIFIED:
        return 'status-verified';
      case RecordStatus.PENDING:
        return 'status-pending';
      case RecordStatus.INCOMPLETE:
        return 'status-incomplete';
      case RecordStatus.REJECTED:
        return 'status-rejected';
      default:
        return '';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
