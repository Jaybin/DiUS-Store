import {
  Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faDollarSign, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FormFields } from 'src/app/constants/form-fields.const';
import { ModalModes } from 'src/app/constants/modal-modes.const';
import { Specials } from 'src/app/constants/specials.const';
import { ICartProduct } from 'src/app/interfaces/cart-product.interface';
import { ISpecial } from 'src/app/interfaces/special.interface';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-details-modal',
  templateUrl: './product-details-modal.component.html',
  styleUrls: ['./product-details-modal.component.css']
})
export class ProductDetailsModalComponent implements OnInit, OnChanges {
  @Input() currentProduct: ICartProduct;
  @Input() productsList: ICartProduct[];
  @Input() mode: string = ModalModes.READONLY;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() save: EventEmitter<any> = new EventEmitter();
  public title = 'Product';
  public productDetailsForm: FormGroup;
  public modalModes = ModalModes;
  public skuFieldName = FormFields.SKU;
  public nameFieldName = FormFields.NAME;
  public priceFieldName = FormFields.PRICE;
  public quantityFieldName = FormFields.QUANTITY;
  public totalFieldName = FormFields.TOTAL;
  public discountFieldName = FormFields.DISCOUNT;
  public freebiesFieldName = FormFields.FREEBIES;
  public faPlus = faPlus;
  public faMinus = faMinus;
  public faDollarSign = faDollarSign;

  constructor(private formBuilder: FormBuilder, private cartService: CartService) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mode?.currentValue) {
      this.title = this.updateTitle(changes.mode.currentValue);
      this.updateFormFields(changes.mode.currentValue);
    }
    if (changes.currentProduct?.currentValue) {
      const productInCart = this.cartService.getProductsCart().find(prod => prod.sku === this.currentProduct.sku);
      if (productInCart) { this.updateForm(productInCart); }
      else { this.updateForm(this.currentProduct); }
    }
  }

  public increaseQuantity(): void {
    this.productDetailsForm.controls[this.discountFieldName].setValue('0.00');
    this.productDetailsForm.controls[this.freebiesFieldName].setValue(0);
    const quantity = +this.productDetailsForm.get([this.quantityFieldName]).value;
    if (quantity >= 100) { return; }
    else {
      this.productDetailsForm.controls[this.quantityFieldName].setValue(quantity + 1);
      const hasSpecialPricing = this.checkForSpecialPricing();
      if (hasSpecialPricing) { return; }
      else {
        const total = this.calculateTotal();
        this.productDetailsForm.controls[this.totalFieldName].setValue(this.formatAmount(total));
      }
    }
  }

  public decreaseQuantity(): void {
    this.productDetailsForm.controls[this.discountFieldName].setValue('0.00');
    this.productDetailsForm.controls[this.freebiesFieldName].setValue(0);
    const quantity = +this.productDetailsForm.get([this.quantityFieldName]).value;
    if (quantity <= 0) { return; }
    else {
      this.productDetailsForm.controls[this.quantityFieldName].setValue(quantity - 1);
      const hasSpecialPricing = this.checkForSpecialPricing();
      if (hasSpecialPricing) { return; }
      else {
        const total = this.calculateTotal();
        this.productDetailsForm.controls[this.totalFieldName].setValue(this.formatAmount(total));
      }
    }
  }

  public onCancel(): void {
    this.cancel.emit(true);
  }

  public onSave(): void {
    this.save.emit(this.productDetailsForm.getRawValue());
  }

  public getSpecialsMessage(): string {
    if (this.currentProduct) {
      const { name, price, special } = this.currentProduct;
      switch (special.type) {
        case Specials.BULK_PURCHASE_DISCOUNT:
          return this.getBulkPurchaseDiscountText(name, price, special.discountedPrice);
        case Specials.FREEBIES:
          return this.getFreebiesText(special.minCount, name, special.freeProductSKU);
        case Specials.GET_ONE_FREE:
          return this.getBuyXGetOneFreeText(special.minCount, name);
        default:
          return 'None';
      }
    }
    return '';
  }

  public checkSaveDisabled(): boolean {
    const price = this.productDetailsForm.get(this.priceFieldName).value;
    return (this.mode === ModalModes.PURCHASE && this.productDetailsForm.get(this.quantityFieldName).value <= 0) ||
    ((this.mode === ModalModes.ADD || this.mode === ModalModes.EDIT) && ((!price) || isNaN(price)));
  }

  private initForm(): void {
    if (!this.productDetailsForm) {
      this.productDetailsForm = this.formBuilder.group({
        [this.skuFieldName]: [{ value: '', disabled: true }],
        [this.nameFieldName]: [{ value: '', disabled: true }, [Validators.required]],
        [this.priceFieldName]: [{ value: '', disabled: true }, [Validators.required]],
        [this.quantityFieldName]: [{ value: '', disabled: true }],
        [this.totalFieldName]: [{ value: '', disabled: true }],
        [this.discountFieldName]: [{ value: '', disabled: true }],
        [this.freebiesFieldName]: [{ value: '', disabled: true }],
      });
    }
  }

  private checkForSpecialPricing(): boolean {
    let hasSpecialPricing = false;
    if (this.currentProduct && this.currentProduct.special.type !== Specials.NONE) {
      const { special } = this.currentProduct;
      switch (special.type) {
        case Specials.BULK_PURCHASE_DISCOUNT:
          hasSpecialPricing = this.calculateBulkPurchaseDiscountTotal(special);
          break;
        case Specials.FREEBIES:
          hasSpecialPricing = this.calculateFreebies(special);
          break;
        case Specials.GET_ONE_FREE:
          hasSpecialPricing = this.calculateGetOneFree(special);
          break;
        default:
          hasSpecialPricing = false;
      }
    }
    return hasSpecialPricing;
  }

  private calculateBulkPurchaseDiscountTotal(special: ISpecial): boolean {
    const quantity = +this.productDetailsForm.get(this.quantityFieldName).value;
    if (quantity >= special.minCount) {
      const originalTotal = this.calculateTotal();
      const newPrice = special.discountedPrice;
      const discountedTotal = newPrice * quantity;
      const discountApplied = originalTotal - discountedTotal;
      this.productDetailsForm.controls[this.totalFieldName].setValue(this.formatAmount(discountedTotal));
      this.productDetailsForm.controls[this.discountFieldName].setValue(this.formatAmount(discountApplied));
      return true;
    }
    return false;
  }

  private calculateFreebies(special: ISpecial): boolean {
    const quantity = +this.productDetailsForm.get(this.quantityFieldName).value;
    if (quantity >= special.minCount) {
      const freebiesReceived = Math.floor(quantity / special.minCount);
      const total = this.calculateTotal();
      this.productDetailsForm.controls[this.totalFieldName].setValue(this.formatAmount(total));
      this.productDetailsForm.controls[this.freebiesFieldName].setValue(freebiesReceived);
      return true;
    }
    return false;
  }

  private calculateGetOneFree(special: ISpecial): boolean {
    const quantity = +this.productDetailsForm.get(this.quantityFieldName).value;
    const price = +this.productDetailsForm.get(this.priceFieldName).value;
    if (quantity >= special.minCount) {
      const freeItems = Math.floor(quantity / special.minCount);
      const originalTotal = this.calculateTotal();
      const discountApplied = price * freeItems;
      const discountedTotal = originalTotal - discountApplied;
      this.productDetailsForm.controls[this.totalFieldName].setValue(this.formatAmount(discountedTotal));
      this.productDetailsForm.controls[this.discountFieldName].setValue(this.formatAmount(discountApplied));
      return true;
    }
    return false;
  }

  private formatAmount(amount: number): string {
    return amount.toFixed(2);
  }

  private calculateTotal(): number {
    let total = 0;
    const quantity = +this.productDetailsForm.get([this.quantityFieldName]).value;
    const price = +this.productDetailsForm.get([this.priceFieldName]).value;
    if (quantity > 0 && price > 0) { total = quantity * price; }
    return total;
  }

  private updateFormFields(value): void {
    switch (value) {
      case ModalModes.ADD:
        this.productDetailsForm.get([this.skuFieldName]).enable();
        this.productDetailsForm.get([this.nameFieldName]).enable();
        this.productDetailsForm.get([this.priceFieldName]).enable();
        this.updateForm(null);
        break;
      case ModalModes.PURCHASE:
      case ModalModes.DELETE:
        this.productDetailsForm.get([this.skuFieldName]).disable();
        this.productDetailsForm.get([this.nameFieldName]).disable();
        this.productDetailsForm.get([this.priceFieldName]).disable();
        break;
      case ModalModes.EDIT:
        this.productDetailsForm.get([this.skuFieldName]).disable();
        this.productDetailsForm.get([this.nameFieldName]).enable();
        this.productDetailsForm.get([this.priceFieldName]).enable();
        break;
    }
  }

  private updateTitle(value): string {
    switch (value) {
      case ModalModes.ADD:
        return 'Add Product (Admin)';
      case ModalModes.EDIT:
        return 'Edit Product (Admin)';
      case ModalModes.DELETE:
        return 'Delete Product (Admin)';
      case ModalModes.PURCHASE:
        return 'Purchase Product (Customer)';
      default:
        return 'Product';
    }
  }

  private updateForm(product: ICartProduct): void {
    this.productDetailsForm.patchValue({
      [this.skuFieldName]: product?.sku || '',
      [this.nameFieldName]: product?.name || '',
      [this.priceFieldName]: product ? this.formatAmount(+product.price) : '0.00',
      [this.quantityFieldName]: product?.quantity || 0,
      [this.totalFieldName]: product?.total || '0.00',
      [this.discountFieldName]: product?.discount || '0.00',
      [this.freebiesFieldName]: product?.freebies || 0
    });
  }

  private getBulkPurchaseDiscountText(name, price, discountedPrice): string {
    return `Buy more than 4 ${name}(s) and
    pay only $${discountedPrice} each instead of $${price}`;
  }

  private getFreebiesText(count, name, freeProductSKU): string {
    const countTxt = count > 1 ? ` ${count} ` : ' ';
    const freeProduct = this.productsList.find(product => product.sku === freeProductSKU);
    const freeProductName = (freeProduct) ? freeProduct.name : freeProductSKU;
    return `With every${countTxt}${name} purchase,
    get one ${freeProductName} free of charge`;
  }

  private getBuyXGetOneFreeText(count, name): string {
    if (count > 1) {
      return `Buy ${count} ${name}(s) for the price of ${count - 1}`;
    } else {
      return '';
    }
  }
}
