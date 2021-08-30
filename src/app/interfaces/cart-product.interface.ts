import { IProduct } from './product.interface';

export interface ICartProduct extends IProduct {
  quantity?: number;
  total?: string;
  discount?: string;
  freebies?: number;
}
