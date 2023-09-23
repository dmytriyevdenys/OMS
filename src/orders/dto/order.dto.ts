import { Buyer } from "src/buyer/schemas/buyer.schema";
import { Product } from "src/products/schemas/product.schema";

export class OrderDto {
    source_id: number;
    manager_id:number;
    manager_comment:string;
    buyer:Buyer;
    shipping:null;
    products:Product;
    payments:null;
    custom_fields:[ {
        uuid:number;
        value:string;
    }]
}