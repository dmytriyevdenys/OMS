import { Injectable } from '@nestjs/common';
import { OrdersApiService } from './orders-api/orders-api.service';

@Injectable()
export class NewOrderWebHookService{
    constructor (private ordersApiService: OrdersApiService) {} 
    
    async newOrderFromWebHook (data: any) {
    
        const {context} = data;
        const newOrder= await this.ordersApiService.getOrderById(context.id);
       
        return newOrder
    }
}