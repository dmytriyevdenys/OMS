import { Injectable } from '@nestjs/common';
import { OrdersApiService } from './orders-api/orders-api.service';

@Injectable()
export class OrdersService {
    constructor(
        private ordersApiService: OrdersApiService
    ) {}


}
