interface ProductCrm { 
    id: number;
  sku: string;
  variation_id: null | number;
  publication_source_uuid: null | string;
  name: string;
  upsale: boolean;
  price: number;
  discount_amount: number;
  discount_percent: number;
  total_discount: number;
  purchased_price: number;
  price_sold: number;
  quantity: number;
  unit_type: null | string;
  picture: any; // Ваш тип даних для цього поля
  comment: null | string;
  properties: any[]; // Ваш тип даних для цього поля
  product_status_id: null | number;
  created_at: string;
  updated_at: string;
  stock_status: null | string;
}