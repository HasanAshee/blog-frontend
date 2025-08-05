import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material-module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Article } from '../../services/article';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../services/notification';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';
import { EditCommentDialogComponent } from '../edit-comment-dialog/edit-comment-dialog';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './comments.html',
  styleUrls: ['./comments.css']
})
export class Comments implements OnInit, OnChanges {
  @Input() comments: any[] | null = [];
  @Input() articleId!: string;
  @Output() commentPosted = new EventEmitter<void>();

  currentUserId: string | null = null;

  commentForm: FormGroup;
  isLoggedIn = false;

  private commentsSubject = new BehaviorSubject<any[]>([]);
  comments$ = this.commentsSubject.asObservable();

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private articleService: Article,
    private notificationService: NotificationService,
    private dialog: MatDialog,
  ) {
    this.commentForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.currentUserId = this.authService.getUserId();
    this.commentsSubject.next(this.comments || []);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['comments']) {
      console.log(changes['comments'].currentValue);
    }
  }

  postComment(): void {
    if (this.commentForm.invalid) {
      return;
    }

    const content = this.commentForm.value.content;
    this.articleService.postComment(this.articleId, content).subscribe({
      next: (newComment) => {
        this.commentForm.reset();
        this.notificationService.showSuccess('Comentario publicado con éxito');
        this.commentPosted.emit();
      },
      error: () => this.notificationService.showError('Error al publicar el comentario')
    });
  }

  deleteComment(commentId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: '¿Estás seguro de que deseas eliminar este comentario?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.articleService.deleteComment(commentId).subscribe({
          next: () => {
            this.notificationService.showSuccess('Comentario eliminado');
            this.commentPosted.emit();
          },
          error: () => this.notificationService.showError('Error al eliminar el comentario')
        });
      }
    });
  }

    editComment(comment: any): void {
        const dialogRef = this.dialog.open(EditCommentDialogComponent, {
          width: '450px',
          data: { content: comment.content }
        });

        dialogRef.afterClosed().subscribe(newContent => {
          if (newContent && newContent !== comment.content) {
            this.articleService.updateComment(comment._id, newContent).subscribe({
              next: () => {
                this.notificationService.showSuccess('Comentario actualizado');
                this.commentPosted.emit();
              },
              error: () => this.notificationService.showError('Error al actualizar el comentario')
            });
          }
        });
    }

}
