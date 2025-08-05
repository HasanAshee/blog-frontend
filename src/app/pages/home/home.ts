import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MaterialModule } from '../../material-module';
import { Article } from '../../services/article';
import { AuthService } from '../../services/auth';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  articles$!: Observable<any[]>;
  currentUserId: string | null = null;

  constructor(
    private articleService: Article,
    private authService: AuthService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.articles$ = this.articleService.getArticles();
    this.currentUserId = this.authService.getUserId();
  }
  deleteArticle(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: '¿Estás seguro de que deseas eliminar este artículo?' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.articleService.deleteArticle(id).subscribe({
          next: () => {
            this.notificationService.showSuccess('Artículo borrado exitosamente');
            this.articles$ = this.articleService.getArticles();
          },
          error: (err) => this.notificationService.showError('Error al borrar el artículo')
        });
      }
    });
  }

  likeArticle(article: any) {
    this.articleService.likeArticle(article._id).subscribe(updatedArticle => {
      article.likes = updatedArticle.likes;
      article.dislikes = updatedArticle.dislikes;
    });
  }

  dislikeArticle(article: any) {
    this.articleService.dislikeArticle(article._id).subscribe(updatedArticle => {
      article.likes = updatedArticle.likes;
      article.dislikes = updatedArticle.dislikes;
    });
  }
}
