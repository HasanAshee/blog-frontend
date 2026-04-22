import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material-module';
import { Article } from '../../services/article';
import { AuthService } from '../../services/auth';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  filteredArticles: any[] = [];
  allArticles: any[] = [];
  currentUserId: string | null = null;
  searchTerm = '';

  currentPage = 1;
  totalPages = 1;

  constructor(
    private articleService: Article,
    private authService: AuthService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserId();
    this.loadPage(1);
  }

  loadPage(page: number): void {
    this.articleService.getArticles(page).subscribe((res: any) => {
      this.allArticles = res.articles;
      this.filteredArticles = res.articles;
      this.totalPages = res.totalPages;
      this.currentPage = page;
    });
  }

  filterArticles(): void {
    this.filteredArticles = this.allArticles.filter(article =>
      article.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
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
            this.loadPage(this.currentPage);
          },
          error: () => this.notificationService.showError('Error al borrar el artículo')
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
