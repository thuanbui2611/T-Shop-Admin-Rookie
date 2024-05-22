
export interface ModelProduct{
  id: string;
  name: string;
  year: number;
  brand: BrandOfModel;
}

export interface BrandOfModel {
  id: string;
  name: string;
}

export interface ModelProductParams {
  pageNumber: number;
  pageSize: number;
}
