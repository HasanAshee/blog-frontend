import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment.pro';

@Injectable({
  providedIn: 'root'
})
export class NotificationApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/notifications`);
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/notifications/unread-count`);
  }

  markAllAsRead(): Observable<any> {
    return this.http.patch(`${this.apiUrl}/notifications/mark-read`, {});
  }
}
