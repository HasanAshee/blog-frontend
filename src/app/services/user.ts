import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getProfile(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/profile/${id}`);
  }
  updateProfile(profileData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/profile`, profileData);
  }
}
