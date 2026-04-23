import { Component, OnInit, OnDestroy, ViewChild, ElementRef, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { Article } from '../../services/article';
import { MaterialModule } from '../../material-module';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../services/notification';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, NgxEditorModule],
  templateUrl: './article-form.html',
  styleUrls: ['./article-form.css']
})
export class ArticleForm implements OnInit, OnDestroy {
  articleForm: FormGroup;
  isEditMode = false;
  private articleId: string | null = null;
  private destroyRef = inject(DestroyRef);

  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3'] }],
    ['link', 'image'],
  ];

  // --- Tags ---
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl('');
  tags: string[] = [];
  allTags: string[] = [];
  filteredTags!: Observable<string[]>;

  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private articleService: Article,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      tags: [[]]
    });
  }

  ngOnInit(): void {
    this.editor = new Editor();

    this.articleService.getAllTags()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(tags => {
        this.allTags = tags;
      });

    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) =>
        value ? this._filter(value) : this.allTags.filter(t => !this.tags.includes(t))
      )
    );

    this.articleId = this.route.snapshot.paramMap.get('id');
    if (this.articleId) {
      this.isEditMode = true;
      this.articleService.getArticle(this.articleId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(article => {
          this.articleForm.patchValue({
            title: article.title,
            content: article.content
          });
          this.tags = article.tags ? [...article.tags] : [];
          this.articleForm.get('tags')?.setValue(this.tags);
        });
    }
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim().toLowerCase();

    if (value && !this.tags.includes(value)) {
      this.tags.push(value);
      this.articleForm.get('tags')?.setValue(this.tags);
    }

    event.chipInput!.clear();
    this.tagCtrl.setValue(null);
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
      this.articleForm.get('tags')?.setValue(this.tags);
    }
  }

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue.toLowerCase();
    if (!this.tags.includes(value)) {
      this.tags.push(value);
      this.articleForm.get('tags')?.setValue(this.tags);
    }
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTags.filter(tag =>
      tag.toLowerCase().includes(filterValue) && !this.tags.includes(tag)
    );
  }

  submitForm() {
    if (this.articleForm.invalid) return;

    const request$ = this.isEditMode && this.articleId
      ? this.articleService.updateArticle(this.articleId, this.articleForm.value)
      : this.articleService.createArticle(this.articleForm.value);

    const action = this.isEditMode ? 'actualizado' : 'creado';

    request$.subscribe({
      next: () => {
        this.notificationService.showSuccess(`Artículo ${action} con éxito`);
        this.router.navigate(['/']);
      },
      error: () => this.notificationService.showError(`Error al ${this.isEditMode ? 'actualizar' : 'crear'} el artículo`)
    });
  }
}
