interface BuyerCrm { 
    id: number;
  company_id: null | number;
  full_name: string;
  phone: string;
  email: null | string;
  note: null | string;
  picture: null | string; // Ваш тип даних для цього поля
  image: null | string; // Ваш тип даних для цього поля
  orders_sum: string;
  currency: string;
  orders_count: number;
  has_duplicates: number;
  manager_id: null | number;
  deleted_at: null | string;
  created_at: string;
  updated_at: string;
}