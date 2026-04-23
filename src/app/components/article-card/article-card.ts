import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material-module';

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './article-card.html',
  styleUrls: ['./article-card.css']
})
export class ArticleCard {
  @Input({ required: true }) article!: any;
  @Input() currentUserId: string | null = null;
  @Input() showOwnerActions = true;

  @Output() like = new EventEmitter<any>();
  @Output() dislike = new EventEmitter<any>();
  @Output() delete = new EventEmitter<string>();

  getReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const text = content.replace(/<[^>]*>/g, '');
    const wordCount = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  onLike() {
    this.like.emit(this.article);
  }

  onDislike() {
    this.dislike.emit(this.article);
  }

  onDelete() {
    this.delete.emit(this.article._id);
  }
}
