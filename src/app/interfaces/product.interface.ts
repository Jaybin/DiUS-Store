import { ISpecial } from './special.interface';

export interface IProduct {
  id?: number;
  name?: string;
  sku?: string;
  price?: string;
  isActive?: boolean;
  special?: ISpecial;
}
