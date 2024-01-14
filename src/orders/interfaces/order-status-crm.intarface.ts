export interface OrderStatusCrm {
  id: number;
  name:
    | 'new'
    | 'Приймає рішення'
    | 'waiting_for_prepayment'
    | 'transferred_to_production'
    | 'Створена ттн'
    | 'Упаковано'
    ;
}
