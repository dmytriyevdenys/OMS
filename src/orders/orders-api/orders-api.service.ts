import { Injectable } from '@nestjs/common';
import { ApiCrmFetchService } from 'src/utils/api-crm-fetch.service';
import { OrderAssociations } from '../interfaces/order-associations.interfaces';

@Injectable()
export class OrdersApiService {
  private readonly baseUrl: string;
  constructor(private apiService: ApiCrmFetchService) {
    this.baseUrl = 'order';
  }

  private async fetchDataAndMap (
    endpoint: string,
    params: Record<string, any> = {},
  ): Promise<OrderAssociations[]> {
    try {
      const data = await this.apiService.get(
        `${this.baseUrl}/${endpoint}`,
        params,
      );
      const response = data.data.map((item) => ({
        id: item.id,
        name: item.name,
      }));
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getOrders() {
    const dataOrders = await this.apiService.get(
      `order?include=shipping.deliveryService,products.offer,manager`,
    );
    return dataOrders;
  }

  async getOrderById(id: string) {
    const order = await this.apiService.get(
      `order/${id}?include=shipping.deliveryService,products.offer,manager`,
    );
    return order;
  }

  async createOrder() {
    
  }

  async getOrderStatus(): Promise<OrderAssociations[]>{
    return this.fetchDataAndMap('status', { limit: 50 });
  }

  async getDeliveryService():Promise<OrderAssociations[]> {
    return this.fetchDataAndMap('delivery-service', { limit: 50 });
  }

  async getTag(): Promise<OrderAssociations[]> {
    return this.fetchDataAndMap('tag');
  }

  async getSource (): Promise<OrderAssociations[]> {
    return this.fetchDataAndMap('source', {limit: 50})
  }

  async getCustomField (): Promise<OrderAssociations[]> {
    const fields = await this.apiService.get('custom-fields');
    const response = fields.map(field => ({
      id: field.id,
      name: field.name,
      uuid: field.uuid
    }));
    return response;
  }
}
