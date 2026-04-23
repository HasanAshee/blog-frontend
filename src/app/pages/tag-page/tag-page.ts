import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material-module';
import { Article } from '../../services/article';
import { AuthService } from '../../services/auth';
import { ArticleCard } from '../../components/article-card/article-card';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-tag-page',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule, ArticleCard],
  templateUrl: './tag-page.html',
  styleUrls: ['./tag-page.css']
})
export class TagPage implements OnInit {
  articles: any[] = [];
  currentUserId: string | null = null;
  tagName = '';
  currentPage = 1;
  totalPages = 1;

  private destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private articleService: Article,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserId();
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        this.tagName = params.get('tagName') || '';
        this.currentPage = 1;
        this.loadPage(1);
      });
  }

  loadPage(page: number): void {
    if (!this.tagName) return;
    this.articleService.getArticlesByTag(this.tagName, page).subscribe((res: any) => {
      this.articles = res.articles;
      this.totalPages = res.totalPages;
      this.currentPage = page;
    });
  }

  likeArticle(article: any) {
    this.articleService.likeArticle(article._id).subscribe(updated => {
      article.likes = updated.likes;
      article.dislikes = updated.dislikes;
    });
  }

  dislikeArticle(article: any) {
    this.articleService.dislikeArticle(article._id).subscribe(updated => {
      article.likes = updated.likes;
      article.dislikes = updated.dislikes;
    });
  }
}
