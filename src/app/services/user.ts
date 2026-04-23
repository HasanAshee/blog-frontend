import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://blog-backend-4lie.onrender.com';

  constructor(private http: HttpClient) { }

  getProfile(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/profile/${id}`);
  }
  updateProfile(profileData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/profile`, profileData);
  }
  followUser(userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${userId}/follow`, {});
  }
}
