import { Component, OnInit, OnDestroy  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Article } from '../../services/article';
import { MaterialModule } from '../..//material-module';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../services/notification';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';


@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, NgxEditorModule],
  templateUrl: './article-form.html',
  styleUrls: ['./article-form.css']
})
export class ArticleForm implements OnInit, OnDestroy{
  articleForm: FormGroup;
  isEditMode = false;
  private articleId: string | null = null;

  editor: Editor = new Editor();
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3'] }],
    ['link', 'image'],
  ];

  constructor(
    private fb: FormBuilder,
    private articleService: Article,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }
  ngOnDestroy(): void {
    this.editor.destroy();
  }

  ngOnInit(): void {
    this.articleId = this.route.snapshot.paramMap.get('id');
    if (this.articleId) {
      this.isEditMode = true;
      this.articleService.getArticle(this.articleId).subscribe(article => {
        this.articleForm.patchValue(article);
      });
    }
  }

  submitForm() {
    if (this.articleForm.invalid) return;

    if (this.isEditMode && this.articleId) {
      this.articleService.updateArticle(this.articleId, this.articleForm.value).subscribe({
        next: () => {
          this.notificationService.showSuccess('Artículo actualizado con éxito');
          this.router.navigate(['/']);
        },
        error: (err) => this.notificationService.showError('Error al actualizar el artículo')
      });
    } else {
      this.articleService.createArticle(this.articleForm.value).subscribe({
        next: () => {
          this.notificationService.showSuccess('Artículo creado con éxito');
          this.router.navigate(['/']);
        },
        error: (err) => this.notificationService.showError('Error al crear el artículo')
      });
    }
  }
}
