import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { IProduct } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';

  constructor(private http: HttpClient) {}

  public getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.productsUrl).pipe(
      retry(2),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  public postProductToCatalogue(product: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(this.productsUrl, product).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  public putProductInCatalogue(product: IProduct): Observable<IProduct> {
    return this.http.put<IProduct>(this.productsUrl + '/' + product.id, product).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  public deleteProductFromCatalogue(id: number): Observable<any> {
    return this.http.delete(this.productsUrl + '/' + id).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }
}
