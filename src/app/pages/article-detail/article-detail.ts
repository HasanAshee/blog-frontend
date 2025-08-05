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
}
