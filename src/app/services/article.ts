import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment.pro';


@Injectable({
  providedIn: 'root'
})
export class Article {
  likeArticle(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/articles/${id}/like`, {});
  }

  dislikeArticle(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/articles/${id}/dislike`, {});
  }
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getArticles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/articles`);
  }
  getArticle(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/articles/${id}`);
  }
  createArticle(articleData: { title: string, content: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/articles`, articleData);
  }
  updateArticle(id: string, articleData: { title: string, content: string }): Observable<any> {
    return this.http.patch(`${this.apiUrl}/articles/${id}`, articleData);
  }
  deleteArticle(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/articles/${id}`);
  }
  getComments(articleId: string): Observable<any[]> {

    return this.http.get<any[]>(`${this.apiUrl}/comments/article/${articleId}`);
  }

  postComment(articleId: string, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/comments/article/${articleId}`, { content });
  }

  updateComment(commentId: string, content: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/comments/${commentId}`, { content });
  }

  deleteComment(commentId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/comments/${commentId}`);
  }
}
