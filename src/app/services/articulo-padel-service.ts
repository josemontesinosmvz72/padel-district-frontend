import { HttpClient } from '@angular/common/http';
import { ApiResponsePadel, ApiResponsePadelDetail, Articulo } from '../common/interfaces';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArticuloPadelService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly urlBase: string = 'https://padel-shop.onrender.com/api/v1/articulos';

  getArticulosPaged(page: number, pageSize: number): Observable<ApiResponsePadel> {
    return this.http.get<ApiResponsePadel>(this.urlBase + '/paged?page=' + page + '&limit=' + pageSize);
  }

  getArticulos(page: number, pageSize: number): Observable<ApiResponsePadel> {
    return this.http.get<ApiResponsePadel>(this.urlBase + '?page=' + page + '&limit=' + pageSize);
  }

  getArticulo(id: any): Observable<ApiResponsePadelDetail> {
    return this.http.get<ApiResponsePadelDetail>(this.urlBase + '/detail/' + id);
  }

  getArticulosByCategoria(categoria: string): Observable<ApiResponsePadel> {
    return this.http.get<ApiResponsePadel>(this.urlBase + '/categoria/' + categoria);
  }

  getArticulosBySubcategoria(subcategoria: string): Observable<ApiResponsePadel> {
    return this.http.get<ApiResponsePadel>(this.urlBase + '/subcategoria/' + subcategoria);
  }

  addArticulo(newArticulo: Articulo): Observable<any> {
    return this.http.post<any>(this.urlBase + '/addOne', newArticulo);
  }

  updateArticulo(articulo: Articulo): Observable<any> {
    return this.http.patch<any>(this.urlBase + '/updateOne/' + articulo._id, articulo);
  }

  deleteArticulo(id: string): Observable<any> {
    return this.http.delete<any>(this.urlBase + '/deleteOne/' + id);

  }

  getAllArticulos(): Observable<ApiResponsePadel> {
    return this.http.get<ApiResponsePadel>(this.urlBase + '/paged?page=1&limit=200');
  }
}
