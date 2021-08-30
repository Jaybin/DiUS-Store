import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Specials } from '../constants/specials.const';
import { IProduct } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService implements InMemoryDbService {

  constructor() {}

  createDb(): { products: IProduct[] } {
    return {
      products: [
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
      ]
    };
  }
}
