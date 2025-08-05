import { AuthService } from './../../services/auth';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material-module';
import { Router, RouterModule } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { Subscription } from 'rxjs';

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
  private authSubscription!: Subscription;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.authStatus$.subscribe(status => {
      console.log('Navbar recibió un nuevo estado de autenticación:', status);
      this.isLoggedIn = status;
      this.currentUserId = this.authService.getUserId();
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
