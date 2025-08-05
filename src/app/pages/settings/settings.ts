import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../services/notification';
import { UserService } from '../../services/user';
import { MaterialModule } from '../../material-module';


@Component({
  selector: 'app-settings',
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class SettingsComponent implements OnInit {
  profileForm: FormGroup;
  currentUserId: string | null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
  ){
    this.currentUserId = this.authService.getUserId();
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      bio: [''],
      profilePictureUrl: [''],
    });
  }

  ngOnInit(): void {
    if (this.currentUserId) {
      this.userService.getProfile(this.currentUserId).subscribe(data => {
        this.profileForm.patchValue(data.user);
      });
    }
  }

  submitForm() {
    if (this.profileForm.invalid) {
      return;
    }

    const formValue = this.profileForm.value;

    const profileData: any = {
      name: formValue.name,
      bio: formValue.bio,
    };

    if (formValue.profilePictureUrl && formValue.profilePictureUrl.trim() !== '') {
      profileData.profilePictureUrl = formValue.profilePictureUrl;
    }

    this.userService.updateProfile(profileData).subscribe({
      next: () => {
        this.notificationService.showSuccess('Perfil actualizado con éxito');
        this.router.navigate(['/profile', this.currentUserId]);
      },
      error: (httpError) => {
        console.error('Error detallado del backend:', httpError.error);
        const message = Array.isArray(httpError.error.message) ? httpError.error.message[0] : httpError.error.message;
        this.notificationService.showError(message || 'Error al actualizar el perfil.');
      }
    });
  }
}
