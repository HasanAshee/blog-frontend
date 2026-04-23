import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

const MaterialComponents = [
  MatToolbarModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatIconModule,
  MatMenuModule,
  MatBadgeModule,
  MatChipsModule,
  MatAutocompleteModule,
];

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})
export class MaterialModule { }
