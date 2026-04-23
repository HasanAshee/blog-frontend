import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Article } from '../../services/article';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material-module';
import { Comments } from '../../components/comments/comments';

@Component({
  selector: 'app-article-detail',
  imports: [CommonModule, MaterialModule, Comments],
  templateUrl: './article-detail.html',
  styleUrl: './article-detail.css'
})
export class ArticleDetail implements OnInit {
  article$!: Observable<any>;
  private commentsSubject = new BehaviorSubject<any[]>([]);
  comments$ = this.commentsSubject.asObservable();
  articleId!: string;
  copied = false;

  constructor(private route: ActivatedRoute, private articleService: Article) {}

  ngOnInit(): void {
    this.articleId = this.route.snapshot.paramMap.get('id')!;
    if (this.articleId) {
      this.article$ = this.articleService.getArticle(this.articleId);
      this.loadComments();
    }
  }

  loadComments(): void {
    this.articleService.getComments(this.articleId).subscribe(comments => {
      this.commentsSubject.next(comments);
    });
  }

  copyLink(): void {
    navigator.clipboard.writeText(window.location.href);
    this.copied = true;
    setTimeout(() => this.copied = false, 2000);
  }

  getReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const text = content.replace(/<[^>]*>/g, '');
    const wordCount = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }
}
