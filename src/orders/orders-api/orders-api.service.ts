import { Injectable } from '@nestjs/common';
import { ApiCrmFetchService } from 'src/utils/api-crm-fetch.service';

@Injectable()
export class OrdersApiService {
  constructor(private apiCrmFetchService: ApiCrmFetchService) {}

  async getOrders() {
    const dataOrders = await this.apiCrmFetchService.get(`order?include=shipping.deliveryService,products.offer,manager`) 
    return dataOrders
  }

  async getOrderById (id: string) { 
    const order = await this.apiCrmFetchService.get(`order/${id}?include=shipping.deliveryService,products.offer,manager`)
    return order
  }
}
