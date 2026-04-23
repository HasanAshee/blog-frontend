import { AuthService } from './../../services/auth';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material-module';
import { Router, RouterModule } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { NotificationApiService } from '../../services/notification-api';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  currentUserId: string | null = null;
  unreadCount = 0;
  notifications: any[] = [];

  private authSubscription!: Subscription;
  private pollingSubscription!: Subscription;

  constructor(
    public authService: AuthService,
    private router: Router,
    private notificationApi: NotificationApiService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.authStatus$.subscribe(status => {
      this.isLoggedIn = status;
      this.currentUserId = this.authService.getUserId();
      if (status) {
        this.loadUnreadCount();
        this.startPolling();
      } else {
        this.stopPolling();
      }
    });
  }

  loadUnreadCount(): void {
    this.notificationApi.getUnreadCount().subscribe((count: any) => {
      this.unreadCount = count;
    });
  }

  loadNotifications(): void {
    this.notificationApi.getNotifications().subscribe(notifs => {
      this.notifications = notifs;
      if (this.unreadCount > 0) {
        this.notificationApi.markAllAsRead().subscribe(() => {
          this.unreadCount = 0;
        });
      }
    });
  }

  startPolling(): void {
    this.pollingSubscription = interval(30000).subscribe(() => {
      this.loadUnreadCount();
    });
  }

  stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  getNotificationText(notif: any): string {
    const name = notif.sender?.name || 'Alguien';
    switch (notif.type) {
      case 'like':
        return `${name} le dio like a tu artículo "${notif.article?.title || ''}"`;
      case 'comment':
        return `${name} comentó en tu artículo "${notif.article?.title || ''}"`;
      case 'follow':
        return `${name} comenzó a seguirte`;
      default:
        return 'Nueva notificación';
    }
  }

  navigateNotif(notif: any): void {
    if (notif.type === 'follow') {
      this.router.navigate(['/profile', notif.sender._id]);
    } else if (notif.article?._id) {
      this.router.navigate(['/article', notif.article._id]);
    }
  }

  ngOnDestroy(): void {
    if (this.authSubscription) this.authSubscription.unsubscribe();
    this.stopPolling();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
