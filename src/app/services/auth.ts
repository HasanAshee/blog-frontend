import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap  } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../enviroments/enviroment.pro';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'auth_token';

  private authStatus = new BehaviorSubject<boolean>(this.hasToken());
  public authStatus$ = this.authStatus.asObservable();

  constructor(private http: HttpClient) { }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response: any) => {
        this.saveToken(response.access_token);
        this.authStatus.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.authStatus.next(false);
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return this.authStatus.getValue();
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decodedToken: { sub: string } = jwtDecode(token);
    return decodedToken.sub;
  }
}
