export interface IProductForFrontend {
  id: number;
  name: string;
  quantity: number;
  weight: number;
  sku: string | null;
  price: number;
}

export interface IProduct {
  id: number;
  name: string;
  description: string | null;
  thumbnail_url: string;
  quantity: number;
  unit_type: string | null;
  in_reserve: number;
  currency_code: string;
  min_price: number;
  max_price: number;
  weight: number;
  length: number;
  height: number;
  width: number;
  has_offers: boolean;
  is_archived: boolean;
  category_id: number;
  created_at: string;
  updated_at: string;
  sku: string | null;
  barcode: string | null;
  price: number;
  purchased_price: number;
  sources: any[];
}
export interface IProductApiResponse {
  current_page: number;
  data: IProduct[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}