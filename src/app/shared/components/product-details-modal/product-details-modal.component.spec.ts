import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalModes } from 'src/app/constants/modal-modes.const';
import { Specials } from 'src/app/constants/specials.const';
import { ICartProduct } from 'src/app/interfaces/cart-product.interface';
import { CartService } from 'src/app/services/cart.service';

import { ProductDetailsModalComponent } from './product-details-modal.component';

describe('ProductDetailsModalComponent', () => {
  let component: ProductDetailsModalComponent;
  let fixture: ComponentFixture<ProductDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule
      ],
      declarations: [ ProductDetailsModalComponent ],
      providers: [
        FormBuilder,
        CartService,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('increaseQuantity()', () => {
    it('should update the parameters for the product in cart - BULK_PURCHASE_DISCOUNT', () => {
      const cartProduct: ICartProduct = {
        id: 1, sku: 'ipd', name: 'Super iPad', price: '549.99', isActive: true, quantity: 4, total: '2199.96',
        special: { type: Specials.BULK_PURCHASE_DISCOUNT, minCount: 5, discountedPrice: 499.99 }, discount: '0.00', freebies: 0
      };
      component.currentProduct = cartProduct;
      // @ts-ignore
      component.updateForm(cartProduct);
      // @ts-ignore
      component.increaseQuantity();
      const quantityFieldControl = component.productDetailsForm.get(component.quantityFieldName);
      const totalFieldControl = component.productDetailsForm.get(component.totalFieldName);
      const discountFieldControl = component.productDetailsForm.get(component.discountFieldName);
      expect(quantityFieldControl.value).toEqual(5);
      expect(totalFieldControl.value).toEqual('2499.95');
      expect(discountFieldControl.value).toEqual('250.00');
    });

    it('should update the parameters for the product in cart - FREEBIES', () => {
      const cartProduct: ICartProduct = {
        id: 2, sku: 'mbp', name: 'MacBook Pro', price: '1399.99', isActive: true, quantity: 2, total: '2799.98',
        special: { type: Specials.FREEBIES, minCount: 1, freeProductSKU: 'vga' }, discount: '0.00', freebies: 2
      };
      component.currentProduct = cartProduct;
      // @ts-ignore
      component.updateForm(cartProduct);
      // @ts-ignore
      component.increaseQuantity();
      const quantityFieldControl = component.productDetailsForm.get(component.quantityFieldName);
      const totalFieldControl = component.productDetailsForm.get(component.totalFieldName);
      const freebiesFieldControl = component.productDetailsForm.get(component.freebiesFieldName);
      expect(quantityFieldControl.value).toEqual(3);
      expect(totalFieldControl.value).toEqual('4199.97');
      expect(freebiesFieldControl.value).toEqual(3);
    });

    it('should update the parameters for the product in cart - GET_ONE_FREE', () => {
      const cartProduct: ICartProduct = {
        id: 3, sku: 'atv', name: 'Apple TV', price: '109.50', isActive: true, quantity: 2, total: '219.00',
        special: { type: Specials.GET_ONE_FREE, minCount: 3 }, discount: '0.00', freebies: 0
      };
      component.currentProduct = cartProduct;
      // @ts-ignore
      component.updateForm(cartProduct);
      // @ts-ignore
      component.increaseQuantity();
      const quantityFieldControl = component.productDetailsForm.get(component.quantityFieldName);
      const totalFieldControl = component.productDetailsForm.get(component.totalFieldName);
      const discountFieldControl = component.productDetailsForm.get(component.discountFieldName);
      expect(quantityFieldControl.value).toEqual(3);
      expect(totalFieldControl.value).toEqual('219.00');
      expect(discountFieldControl.value).toEqual('109.50');
    });

    it('should update the parameters for the product in cart - NONE', () => {
      const cartProduct: ICartProduct = {
        id: 4, sku: 'vga', name: 'VGA adapter', price: '30.00', isActive: true, quantity: 2, total: '60.00',
        special: { type: Specials.NONE }, discount: '0.00', freebies: 0
      };
      component.currentProduct = cartProduct;
      // @ts-ignore
      component.updateForm(cartProduct);
      // @ts-ignore
      component.increaseQuantity();
      const quantityFieldControl = component.productDetailsForm.get(component.quantityFieldName);
      const totalFieldControl = component.productDetailsForm.get(component.totalFieldName);
      const discountFieldControl = component.productDetailsForm.get(component.discountFieldName);
      expect(quantityFieldControl.value).toEqual(3);
      expect(totalFieldControl.value).toEqual('90.00');
      expect(discountFieldControl.value).toEqual('0.00');
    });
  });

  describe('decreaseQuantity()', () => {
    it('should update the parameters for the product in cart - BULK_PURCHASE_DISCOUNT', () => {
      const cartProduct: ICartProduct = {
        id: 1, sku: 'ipd', name: 'Super iPad', price: '549.99', isActive: true, quantity: 5, total: '2499.95',
        special: { type: Specials.BULK_PURCHASE_DISCOUNT, minCount: 5, discountedPrice: 499.99 }, discount: '250.00', freebies: 0
      };
      component.currentProduct = cartProduct;
      // @ts-ignore
      component.updateForm(cartProduct);
      // @ts-ignore
      component.decreaseQuantity();
      const quantityFieldControl = component.productDetailsForm.get(component.quantityFieldName);
      const totalFieldControl = component.productDetailsForm.get(component.totalFieldName);
      const discountFieldControl = component.productDetailsForm.get(component.discountFieldName);
      expect(quantityFieldControl.value).toEqual(4);
      expect(totalFieldControl.value).toEqual('2199.96');
      expect(discountFieldControl.value).toEqual('0.00');
    });

    it('should update the parameters for the product in cart - FREEBIES', () => {
      const cartProduct: ICartProduct = {
        id: 2, sku: 'mbp', name: 'MacBook Pro', price: '1399.99', isActive: true, quantity: 2, total: '2799.98',
        special: { type: Specials.FREEBIES, minCount: 1, freeProductSKU: 'vga' }, discount: '0.00', freebies: 2
      };
      component.currentProduct = cartProduct;
      // @ts-ignore
      component.updateForm(cartProduct);
      // @ts-ignore
      component.decreaseQuantity();
      const quantityFieldControl = component.productDetailsForm.get(component.quantityFieldName);
      const totalFieldControl = component.productDetailsForm.get(component.totalFieldName);
      const freebiesFieldControl = component.productDetailsForm.get(component.freebiesFieldName);
      expect(quantityFieldControl.value).toEqual(1);
      expect(totalFieldControl.value).toEqual('1399.99');
      expect(freebiesFieldControl.value).toEqual(1);
    });

    it('should update the parameters for the product in cart - GET_ONE_FREE', () => {
      const cartProduct: ICartProduct = {
        id: 3, sku: 'atv', name: 'Apple TV', price: '109.50', isActive: true, quantity: 3, total: '219.00',
        special: { type: Specials.GET_ONE_FREE, minCount: 3 }, discount: '109.50', freebies: 0
      };
      component.currentProduct = cartProduct;
      // @ts-ignore
      component.updateForm(cartProduct);
      // @ts-ignore
      component.decreaseQuantity();
      const quantityFieldControl = component.productDetailsForm.get(component.quantityFieldName);
      const totalFieldControl = component.productDetailsForm.get(component.totalFieldName);
      const discountFieldControl = component.productDetailsForm.get(component.discountFieldName);
      expect(quantityFieldControl.value).toEqual(2);
      expect(totalFieldControl.value).toEqual('219.00');
      expect(discountFieldControl.value).toEqual('0.00');
    });

    it('should update the parameters for the product in cart - NONE', () => {
      const cartProduct: ICartProduct = {
        id: 4, sku: 'vga', name: 'VGA adapter', price: '30.00', isActive: true, quantity: 2, total: '60.00',
        special: { type: Specials.NONE }, discount: '0.00', freebies: 0
      };
      component.currentProduct = cartProduct;
      // @ts-ignore
      component.updateForm(cartProduct);
      // @ts-ignore
      component.decreaseQuantity();
      const quantityFieldControl = component.productDetailsForm.get(component.quantityFieldName);
      const totalFieldControl = component.productDetailsForm.get(component.totalFieldName);
      const discountFieldControl = component.productDetailsForm.get(component.discountFieldName);
      expect(quantityFieldControl.value).toEqual(1);
      expect(totalFieldControl.value).toEqual('30.00');
      expect(discountFieldControl.value).toEqual('0.00');
    });
  });

  describe('checkSaveDisabled()', () => {
    it('should disable save in purchase mode when quantity is <= 0', () => {
      const cartProduct: ICartProduct = {
        id: 4, sku: 'vga', name: 'VGA adapter', price: '30.00', isActive: true, quantity: 0, total: '0.00',
        special: { type: Specials.NONE }, discount: '0.00', freebies: 0
      };
      component.currentProduct = cartProduct;
      component.mode = ModalModes.PURCHASE;
      // @ts-ignore
      component.updateForm(cartProduct);
      const bool = component.checkSaveDisabled();
      expect(bool).toEqual(true);
    });

    it('should disable save in add mode when price is not entered', () => {
      const cartProduct: ICartProduct = {
        id: 4, sku: 'vga', name: 'VGA adapter', price: '', isActive: true, quantity: 0, total: '0.00',
        special: { type: Specials.NONE }, discount: '0.00', freebies: 0
      };
      component.currentProduct = cartProduct;
      component.mode = ModalModes.ADD;
      // @ts-ignore
      component.updateForm(cartProduct);
      component.productDetailsForm.get(component.priceFieldName).setValue('');
      const bool = component.checkSaveDisabled();
      expect(bool).toEqual(true);
    });

    it('should disable save in add mode when price is not numeric', () => {
      const cartProduct: ICartProduct = {
        id: 4, sku: 'vga', name: 'VGA adapter', price: 'abc', isActive: true, quantity: 0, total: '0.00',
        special: { type: Specials.NONE }, discount: '0.00', freebies: 0
      };
      component.currentProduct = cartProduct;
      component.mode = ModalModes.ADD;
      // @ts-ignore
      component.updateForm(cartProduct);
      const bool = component.checkSaveDisabled();
      expect(bool).toEqual(true);
    });
  });
});
