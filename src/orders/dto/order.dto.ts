import { BuyerDto } from "src/buyer/dto/buyer.dto";
import { Buyer } from "src/buyer/schemas/buyer.schema";
import { Sender } from "src/novaposhta/schemas/sender.schema";
import { Product } from "src/products/schemas/product.schema";
import { IBuyer } from "../interfaces/order-associations.interfaces";

export class OrderCrmDto {
    source_id: number;
    manager_id:number;
    manager_comment:string;
    buyer:Buyer;
    shipping:null;
    products:Product[];
    payments:null;
    custom_fields:[ {
        uuid:number;
        value:string;
    }]
}

export class NewOrderDto { 
    sender: Sender;
    user: string;
    source_id: string;
    manager_id: string;
    products:Product[];
    totalPrice: number;
    additionalnformation: string;
    paymets:[];
    buyer: BuyerDto[];
    notes:string[];
}