import { Component, OnDestroy, OnInit } from '@angular/core';
import { IProduct } from '../interfaces/product.interface';
import { ProductService } from '../services/product.service';
import { faCartPlus, faPencilAlt, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ModalModes } from '../constants/modal-modes.const';
import { CartService } from '../services/cart.service';
import { ICartProduct } from '../interfaces/cart-product.interface';
import { Specials } from '../constants/specials.const';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit, OnDestroy {
  public products: IProduct[] = [];
  public faPlus = faPlus;
  public faCartPlus = faCartPlus;
  public faPencilAlt = faPencilAlt;
  public faTrashAlt = faTrashAlt;
  public isModalOpen = false;
  public currentProduct: IProduct;
  public mode: string = ModalModes.READONLY;
  public loading = false;
  private subscriptions: Subscription = new Subscription();

  constructor(private productService: ProductService, private cartService: CartService) { }

  ngOnInit(): void {
    this.getProductsInCatalogue();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public openModalInAddMode(): void {
    this.openModal(ModalModes.ADD, null, true);
  }

  public openModalInPurchaseMode(product: IProduct): void {
    this.openModal(ModalModes.PURCHASE, product, true);
  }

  public openModalInEditMode(product: IProduct): void {
    this.openModal(ModalModes.EDIT, product, true);
  }

  public openModalInDeleteMode(product: IProduct): void {
    this.openModal(ModalModes.DELETE, product, true);
  }

  public onModalCancel(): void {
    this.openModal(ModalModes.READONLY, null, false);
  }

  public onModalSave(product: ICartProduct): void {
    switch (this.mode) {
      case ModalModes.ADD:
        this.addProductToCatalogue(product);
        break;
      case ModalModes.EDIT:
        this.editProductInCatalogue(product);
        break;
      case ModalModes.DELETE:
        this.deleteProductFromCatalogue(product);
        break;
      case ModalModes.PURCHASE:
        this.updateCart(product);
        break;
    }
    this.openModal(ModalModes.READONLY, null, false);
  }

  private getProductsInCatalogue(): void {
    this.loading = true;
    this.products = [];
    const sub: Subscription = this.productService.getProducts().subscribe((products) => {
      this.loading = false;
      this.products = products;
    }, (error) => {
      this.loading = false;
    });
    this.subscriptions.add(sub);
  }

  private addProductToCatalogue(product: ICartProduct): void {
    const { sku, name, price } = product;
    const newProduct: IProduct = { sku, name, price, special: { type: Specials.NONE }, isActive: true };
    const sub: Subscription = this.productService.postProductToCatalogue(newProduct).subscribe(() => this.getProductsInCatalogue());
    this.subscriptions.add(sub);
  }

  private editProductInCatalogue(product: ICartProduct): void {
    const { sku, name, price } = product;
    let updatedProduct: IProduct = this.products.find(prod => prod.sku === sku);
    if (updatedProduct) { updatedProduct = { ...updatedProduct, name, price }; }
    else { return; }
    const sub: Subscription = this.productService.putProductInCatalogue(updatedProduct).subscribe(() => this.getProductsInCatalogue());
    this.subscriptions.add(sub);
  }

  private deleteProductFromCatalogue(product: ICartProduct): void {
    const deletedProduct: IProduct = this.products.find(prod => prod.sku === product.sku);
    const sub: Subscription =
    this.productService.deleteProductFromCatalogue(deletedProduct.id).subscribe(() => this.getProductsInCatalogue());
    this.subscriptions.add(sub);
  }

  private updateCart(cartProduct: ICartProduct): void {
    const purchaseProduct: IProduct =
    this.products.find(prod => prod.sku === cartProduct.sku);
    const existingCartProduct = this.cartService.getProductsCart().find(prod => prod.sku === cartProduct.sku);
    if (!existingCartProduct) { this.cartService.postProductToCart({ ...cartProduct, special: purchaseProduct.special }); }
    else { this.cartService.putProductInCart({ ...cartProduct }); }
    if (cartProduct.freebies > 0) {
      const freebieProduct: IProduct =
      this.products.find(prod => prod.sku === purchaseProduct.special.freeProductSKU);
      let freebieCartProduct: ICartProduct =
      this.cartService.getFreebiesCart().find(prod => prod.sku === freebieProduct.sku);
      if (!freebieCartProduct) {
        const { sku, name, price } = freebieProduct;
        freebieCartProduct = { sku, name, price, quantity: cartProduct.freebies, total: '0.00', discount: '0.00' };
        this.cartService.postFreebieToCart({ ...freebieCartProduct });
      } else {
        freebieCartProduct.quantity = cartProduct.freebies;
        this.cartService.putFreebieInCart({ ...freebieCartProduct });
      }
    }
  }

  private openModal(mode: string, product: IProduct, isModalOpen: boolean = false): void {
    this.mode = mode;
    this.currentProduct = product;
    this.isModalOpen = isModalOpen;
  }
}
