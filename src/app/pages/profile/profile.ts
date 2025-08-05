import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MaterialModule } from '../../material-module';
import { UserService } from '../../services/user';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Article } from '../../services/article';


@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  profileData$!: Observable<any>;
  currentUserId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private articleService: Article
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserId();
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.profileData$ = this.userService.getProfile(userId);
    }
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
