import { BuyerDto } from "src/buyer/dto/buyer.dto";
import { Buyer } from "src/buyer/schemas/buyer.schema";
import { Sender } from "src/novaposhta/schemas/sender.schema";
import { Product } from "src/products/schemas/product.schema";


export class OrderCrmDto {
    source_id: number;
    manager_id: number;
    manager_comment?: string;
    buyer: {
        full_name:string
        phone: string
    };
    shipping: {};
    products: Product[];
    payments: Payments[];
    custom_fields: CustomField[];
  }
  
  
  export class CustomField {
    uuid: string;
    value: string;
  }

  export class Payments { 
    id: string;
    payment_method: string
    amount: string
    status?: string
  }

export class OrderDto {
    id: string; 
    order_id?:string;
    sender: Sender;
    user: string;
    shipping:{};
    source_id: number;
    manager_id: number;
    products:Product[];
    totalPrice: number;
    additionalnformation: string;
    payments:Payments[];
    buyer: BuyerDto[];
    notes:string[];
}