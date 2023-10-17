import { Injectable, BadRequestException } from '@nestjs/common';
import { ApiCrmFetchService } from 'src/utils/api-crm-fetch.service';
import { OrderAssociations } from '../interfaces/order-associations.interfaces';
import { OrderDto, OrderCrmDto } from '../dto/order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';


@Injectable()
export class OrdersApiService {
  private readonly baseUrl: string;
  constructor(
    private apiService: ApiCrmFetchService,

    ) {
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

  private async  mapDto (dto: any): Promise<OrderCrmDto> {
    const crmDto: OrderCrmDto = {
      source_id: dto.source_id,
      manager_id: dto.manager_id,
      buyer: {
        full_name: dto.buyer.full_name,
        phone: dto.buyer.phones[0],
      },
      shipping: {},
      products: dto.products, 
      payments: dto?.payments?.length > 0 ? dto.payments.map((payment) => ({
        id:'2',
        payment_method: payment.payment_method,
        amount: payment.amount,
        status: 'paid',
      })): [],
      custom_fields: [
        {
          uuid: "OR_1001", 
          value: dto.notes?.toString(), 
        },
        {
          uuid: "OR_1002",
          value: dto.additionalnformation, 
        },
      ],
    };
    return crmDto;
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

  async createOrder(dto: Partial<OrderDto>): Promise<OrderCrm> {

    try {

     const crmDto = await this.mapDto(dto);
        const newOrder = await this.apiService.post(`${this.baseUrl}`, crmDto)
        if(!newOrder) {
          throw new BadRequestException('Помилка при створенні замовленняв СРМ')
        }
        return newOrder;
    } catch (error) {
      
        throw error;
      
    }

  }

  async updateOrder (dto: UpdateOrderDto) {
   try { 
    const id = dto.orderCrm_id; 
    const crmData = await this.mapDto(dto);
    const updateOrder= await this.apiService.put(`${this.baseUrl}/${id}`, crmData);
    return updateOrder;
   } catch(error) { 
    throw error;
   }    
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
    return await this.fetchDataAndMap('source', {limit: 50})
  }

 

  async getCustomField (): Promise<OrderAssociations[]> {
    const fields = await this.apiService.get('custom-fields');
    const response = fields.map(field => ({
      id: field.id,
      value: field.name,
      uuid: field.uuid
    }));
    return response;
  }

  async getPayment (): Promise<OrderAssociations[]> {
    return  this.fetchDataAndMap('payment-method');
  }
}
