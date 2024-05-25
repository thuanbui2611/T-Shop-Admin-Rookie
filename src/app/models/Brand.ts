export interface Brand {
  id: string;
  name: string;
  models: ModelOfBrand[]
}

export interface ModelOfBrand
{
  id: string;
  name: string;
  year: number
}

export interface BrandParams {
  pageNumber: number;
  pageSize: number;
}
