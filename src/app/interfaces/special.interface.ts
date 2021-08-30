import { Specials } from '../constants/specials.const';

export interface ISpecial {
  type: Specials;
  minCount?: number;
  discountedPrice?: number;
  freeProductSKU?: string;
}
