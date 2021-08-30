import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BehaviorSubject, of } from 'rxjs';
import { ModalModes } from '../constants/modal-modes.const';
import { Specials } from '../constants/specials.const';
import { ICartProduct } from '../interfaces/cart-product.interface';
import { IProduct } from '../interfaces/product.interface';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';
import { ProductDetailsModalComponent } from '../shared/components/product-details-modal/product-details-modal.component';

import { CatalogueComponent } from './catalogue.component';

describe('CatalogueComponent', () => {
  let component: CatalogueComponent;
  let fixture: ComponentFixture<CatalogueComponent>;
  const products: IProduct[] = [
    {
      id: 1,
      name: 'Super iPad',
      sku: 'ipd',
      price: '549.99',
      isActive: true,
      special: {
        type: Specials.BULK_PURCHASE_DISCOUNT,
        minCount: 5,
        discountedPrice: 499.99
      }
    },
    {
      id: 2,
      name: 'MacBook Pro',
      sku: 'mbp',
      price: '1399.99',
      isActive: true,
      special: {
        type: Specials.FREEBIES,
        minCount: 1,
        freeProductSKU: 'vga'
      }
    },
    {
      id: 3,
      name: 'Apple TV',
      sku: 'atv',
      price: '109.50',
      isActive: true,
      special: {
        type: Specials.GET_ONE_FREE,
        minCount: 3
      }
    },
    {
      id: 4,
      name: 'VGA adapter',
      sku: 'vga',
      price: '30.00',
      isActive: true,
      special: {
        type: Specials.NONE
      }
    }
  ];
  const getProductsSubject = new BehaviorSubject(products);

  let productService = jasmine.createSpyObj('ProductService', {
    getProducts: getProductsSubject.asObservable(),
    postProductToCatalogue: () => {},
    putProductInCatalogue: () => {},
    deleteProductFromCatalogue: () => {}
  });
  let cartService: CartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FontAwesomeModule ],
      declarations: [ CatalogueComponent, ProductDetailsModalComponent ],
      providers: [
        { provide: ProductService, useValue: productService },
        FormBuilder,
        CartService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    cartService = TestBed.inject(CartService);
    fixture = TestBed.createComponent(CatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openModalInPurchaseMode()', () => {
    it('should set appropriate value for mode, currentProduct, isModalOpen', () => {
      const product: IProduct = {
        sku: 'abc', name: 'ABCDEF', price: '100', special: { type: Specials.NONE }, id: 1, isActive: true
      };
      component.openModalInPurchaseMode(product);
      expect(component.mode).toEqual(ModalModes.PURCHASE);
      expect(component.isModalOpen).toEqual(true);
    });
  });

  describe('onModalSave()', () => {
    it('should call addProductToCatalogue()', () => {
      component.mode = ModalModes.ADD;
      const product: ICartProduct = {
        sku: 'abc', name: 'ABCDEF', price: '100', special: { type: Specials.NONE }, id: 1, isActive: true,
        quantity: 5, total: '500', freebies: 0, discount: '0.00'
      };
      // @ts-ignore
      const spy = spyOn(component, 'addProductToCatalogue');
      component.onModalSave(product);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call editProductInCatalogue()', () => {
      component.mode = ModalModes.EDIT;
      const product: ICartProduct = {
        sku: 'abc', name: 'ABCDEF', price: '100', special: { type: Specials.NONE }, id: 1, isActive: true,
        quantity: 5, total: '500', freebies: 0, discount: '0.00'
      };
      // @ts-ignore
      const spy = spyOn(component, 'editProductInCatalogue');
      component.onModalSave(product);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call deleteProductFromCatalogue()', () => {
      component.mode = ModalModes.DELETE;
      const product: ICartProduct = {
        sku: 'abc', name: 'ABCDEF', price: '100', special: { type: Specials.NONE }, id: 1, isActive: true,
        quantity: 5, total: '500', freebies: 0, discount: '0.00'
      };
      // @ts-ignore
      const spy = spyOn(component, 'deleteProductFromCatalogue');
      component.onModalSave(product);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call updateCart()', () => {
      component.mode = ModalModes.PURCHASE;
      const product: ICartProduct = {
        sku: 'abc', name: 'ABCDEF', price: '100', special: { type: Specials.NONE }, id: 1, isActive: true,
        quantity: 5, total: '500', freebies: 0, discount: '0.00'
      };
      // @ts-ignore
      const spy = spyOn(component, 'updateCart');
      component.onModalSave(product);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateCart', () => {
    it('should call postProductToCart in cartService', () => {
      const cartProduct: ICartProduct = { ...products[0], quantity: 5, total: '2499.95', discount: '250.00', freebies: 0 };
      const spy = spyOn(cartService, 'postProductToCart');
      // @ts-ignore
      component.updateCart(cartProduct);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call putProductInCart in cartService', () => {
      let cartProduct: ICartProduct = { ...products[3], quantity: 1, total: '30.00', discount: '0.00', freebies: 0 };
      cartService.postProductToCart(cartProduct);
      cartProduct = { ...cartProduct, quantity: 2, total: '60.00', discount: '0.00', freebies: 0 };
      const spy = spyOn(cartService, 'putProductInCart');
      // @ts-ignore
      component.updateCart(cartProduct);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call postFreebieToCart in cartService', () => {
      const cartProduct: ICartProduct = { ...products[1], quantity: 1, total: '1399.99', discount: '0.00', freebies: 1 };
      cartService.postProductToCart(cartProduct);
      const spy = spyOn(cartService, 'postFreebieToCart');
      // @ts-ignore
      component.updateCart(cartProduct);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call putFreebieInCart in cartService', () => {
      let cartProduct: ICartProduct = { ...products[1], quantity: 1, total: '1399.99', discount: '0.00', freebies: 1 };
      cartService.postProductToCart(cartProduct);
      const freebiesProduct: ICartProduct = { ...products[3], quantity: 1, total: '0', discount: '0.00', freebies: 0 };
      cartService.postFreebieToCart(freebiesProduct);
      cartProduct = { ...cartProduct, quantity: 2, total: '2799.98', discount: '0.00', freebies: 2 };
      const spy = spyOn(cartService, 'putFreebieInCart');
      // @ts-ignore
      component.updateCart(cartProduct);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
