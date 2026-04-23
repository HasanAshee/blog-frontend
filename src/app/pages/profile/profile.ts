import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  profileData: any = null;
  currentUserId: string | null = null;
  profileUserId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private articleService: Article
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserId();
    this.profileUserId = this.route.snapshot.paramMap.get('id');
    if (this.profileUserId) {
      this.loadProfile();
    }
  }

  loadProfile(): void {
    if (!this.profileUserId) return;
    this.userService.getProfile(this.profileUserId).subscribe(data => {
      this.profileData = data;
    });
  }

  isFollowing(): boolean {
    if (!this.profileData || !this.currentUserId) return false;
    return this.profileData.user.followers?.some((id: string) => id === this.currentUserId);
  }

  toggleFollow(): void {
    if (!this.profileUserId) return;
    this.userService.followUser(this.profileUserId).subscribe(() => {
      this.loadProfile();
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
