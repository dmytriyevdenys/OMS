import { BuyerDto } from "src/buyer/dto/buyer.dto";
import { BuyerEntity } from "src/buyer/entities/buyer.entity";
import { InternetDocumnetEntity } from "src/novaposhta/internet-document/entities/internet-document.entity";
import { SenderEntity } from "src/novaposhta/sender/entities/sender.entity";
import { ProductEntity } from "src/products/entities/product.entity";


export class OrderCrmDto {
    source_id: number;
    manager_id: number;
    status_id: number;
    manager_comment?: string;
    buyer: {
        full_name:string
        phone: string
    };
    shipping: {};
    products: ProductEntity[];
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
    id: number; 
    status_id: number;
    orderCrm_id: string;
    order_id?:string;
    sender: SenderEntity;
    shipping: InternetDocumnetEntity;
    source_id: number;
    manager_id: number;
    products:ProductEntity[];
    totalPrice: number;
    additionalnformation: string;
    payments:Payments[];
    buyer: BuyerEntity;
    notes:string[];
}