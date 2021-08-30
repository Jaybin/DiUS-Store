import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Specials } from '../constants/specials.const';
import { ICartProduct } from '../interfaces/cart-product.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private productsCart: ICartProduct[] = [];
  private freebiesCart: ICartProduct[] = [];

  constructor() {}

  public getProductsCart(): ICartProduct[] {
    return this.productsCart;
  }

  public postProductToCart(product: ICartProduct): void {
    const id = this.productsCart.length + 1;
    this.productsCart.push({ ...product, id });
  }

  public putProductInCart(product: ICartProduct): void {
    const index = this.productsCart.findIndex(prod => prod.id === product.id);
    if (index > -1) {
      this.productsCart.splice(index, 1, product);
    } else {
      // TODO
      // Show error toast message
    }
  }

  public deleteProductFromCart(product: ICartProduct): void {
    const index = this.productsCart.findIndex(prod => prod.id === product.id);
    if (index > -1) {
      this.productsCart.splice(index, 1);
      this.productsCart = this.productsCart.map((prod, ind) => ({ ...prod, id: (ind + 1) }));
      if (product.special.type === Specials.FREEBIES) {
        this.deleteFreebieFromCart(product.special.freeProductSKU);
      }
    } else {
      // TODO
      // Show error toast message
    }
  }

  public getFreebiesCart(): ICartProduct[] {
    return this.freebiesCart;
  }

  public postFreebieToCart(product: ICartProduct): void {
    const id = this.freebiesCart.length + 1;
    this.freebiesCart.push({ ...product, id });
  }

  public putFreebieInCart(product: ICartProduct): void {
    const index = this.freebiesCart.findIndex(prod => prod.id === product.id);
    if (index > -1) {
      this.freebiesCart.splice(index, 1, product);
    } else {
      // TODO
      // Show error toast message
    }
  }

  public deleteFreebieFromCart(sku: string): void {
    const index = this.freebiesCart.findIndex(prod => prod.sku === sku);
    if (index > -1) {
      this.freebiesCart.splice(index, 1);
      this.freebiesCart = this.freebiesCart.map((prod, ind) => ({ ...prod, id: (ind + 1) }));
    } else {
      // TODO
      // Show error toast message
    }
  }
}
