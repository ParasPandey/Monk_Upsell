import { DiscountType } from "../enums/DiscountType";

export interface ProductVariant {
  id: number;
  product_id: number;
  title: string;
  price: string;
  inventory_quantity: number;
}

export interface ProductImage {
  id: number;
  product_id: number;
  src: string;
}

export interface Product {
  id: number;
  title: string;
  variants?: ProductVariant[];
  image: ProductImage;
  discount?: ProductDiscount;
}

export interface ProductDiscount {
  amount?: number;
  type?: DiscountType;
}
