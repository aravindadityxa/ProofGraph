import { Component, Input, OnInit } from '@angular/core';

interface Activity {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  icon: string;
}

@Component({
  selector: 'app-activity-feed',
  templateUrl: './activity-feed.component.html',
  styleUrls: ['./activity-feed.component.scss']
})
export class ActivityFeedComponent implements OnInit {
  @Input() userId!: string;
  activities: Activity[] = [];

  ngOnInit(): void {
    this.generateActivities();
  }

  generateActivities(): void {
    const now = new Date();
    
    this.activities = [
      {
        id: '1',
        type: 'verification',
        message: 'Employment record verified',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        icon: '✓'
      },
      {
        id: '2',
        type: 'sync',
        message: 'Records synchronized successfully',
        timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000),
        icon: '↻'
      },
      {
        id: '3',
        type: 'update',
        message: 'Profile information updated',
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        icon: '●'
      },
      {
        id: '4',
        type: 'verification',
        message: 'Education record verified',
        timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        icon: '✓'
      },
      {
        id: '5',
        type: 'request',
        message: 'Verification request submitted',
        timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        icon: '→'
      }
    ];
  }

  formatTimestamp(timestamp: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  }

  getActivityClass(type: string): string {
    switch (type) {
      case 'verification':
        return 'activity-verification';
      case 'sync':
        return 'activity-sync';
      case 'update':
        return 'activity-update';
      case 'request':
        return 'activity-request';
      default:
        return '';
    }
  }
}
