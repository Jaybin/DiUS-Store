import { Component, OnInit } from '@angular/core';
import { faGifts, faTrashAlt, faWallet } from '@fortawesome/free-solid-svg-icons';
import { ICartProduct } from '../interfaces/cart-product.interface';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  public productsCart: ICartProduct[] = [];
  public freebiesCart: ICartProduct[] = [];
  public faTrashAlt = faTrashAlt;
  public faGifts = faGifts;
  public faWallet = faWallet;
  public total = 0;
  public discount = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.init();
  }

  public removeFromCart(product: ICartProduct): void {
    this.cartService.deleteProductFromCart(product);
    this.init();
  }

  public proceedToPayment(): void {
    console.log('Proceeding to payment...');
  }

  private init(): void {
    this.productsCart = this.cartService.getProductsCart();
    this.freebiesCart = this.cartService.getFreebiesCart();
    this.total = this.calculateSum('total');
    this.discount = this.calculateSum('discount');
  }

  private calculateSum(property: string): number {
    let value = this.productsCart.reduce((result, product) => {
      result += +product[property];
      return result;
    }, 0);
    value = +value.toFixed(2);
    return value;
  }
}
