import { Color } from "./Color"
import { ModelProduct } from "./ModelProduct"
import { Type } from "./Type"


export interface Product {
  id: string
  name: string
  price: number
  description: string
  createdAt: string
  isOnStock: string
  variant: string
  rating: number
  totalReviews: number
  type: Type
  model: ModelProduct
  color: Color
  images: ImageOfProduct[]
}

export interface ImageOfProduct {
  imageID: string | null;
  imageUrl: string | null;
  isMain: boolean
}

export interface ProductParams{
  pageNumber: number;
  pageSize: number;

  types?: string[];
  brands?: string[];
  models?: string[];
  colors?: string[];
  search?: string;
}

