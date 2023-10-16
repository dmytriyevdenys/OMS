
interface OrderCrm { 
    id: string;
    source_uuid: null | string;
    global_source_uuid: null | string;
    status_on_source: null | string;
    source_id: number;
    client_id: number;
    grand_total: number;
    total_discount: number;
    margin_sum: number;
    expenses_sum: number;
    discount_amount: number;
    discount_percent: number;
    shipping_price: null | number;
    taxes: null | number;
    register_id: null | number;
    fiscal_result: any[]; // Ваш тип даних для цього поля
    fiscal_status: null | string;
    shipping_type_id: null | number;
    status_group_id: number;
    status_id: string;
    closed_from: null | string;
    status_expired_at: null | string;
    status_changed_at: string;
    parent_id: null | number;
    manager_comment: null | string;
    client_comment: null | string;
    is_gift: boolean;
    promocode: null | string;
    wrap_price: null | number;
    gift_wrap: boolean;
    payment_status: string;
    gift_message: null | string;
    last_synced_at: null | string;
    created_at: string;
    updated_at: string;
    closed_at: null | string;
    ordered_at: string;
    source_updated_at: null | string;
    deleted_at: null | string;
    payments_total: number;
    is_expired: boolean;
    has_reserves: boolean;
    buyer_comment: null | string;
    products: ProductCrm[];
    buyer: BuyerCrm;
    shipping: null | any; // Ваш тип даних для цього поля
    payments: PaymentCrm[];
}