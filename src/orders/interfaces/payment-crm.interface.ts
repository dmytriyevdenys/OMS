interface PaymentCrm { 
    id: number;
    destination_id: number;
    destination_type: string;
    amount: number;
    source_currency: string;
    actual_amount: number;
    actual_currency: string;
    is_expense: boolean;
    payment_method_id: number;
    expense_type_id: null | number;
    transaction_uuid: null | string;
    description: null | string;
    status: string;
    payment_date: string;
    created_at: string;
    updated_at: string;
}