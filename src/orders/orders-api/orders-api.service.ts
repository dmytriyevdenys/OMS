import { Injectable, BadRequestException } from '@nestjs/common';
import { ApiCrmFetchService } from 'src/utils/api-crm-fetch.service';
import { OrderAssociations } from '../interfaces/order-associations.interfaces';
import { OrderDto, OrderCrmDto } from '../dto/order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderStatusCrm } from '../interfaces/order-status-crm.intarface';
import { TTag } from '../interfaces/tag-crm.type';
import { OrderCrm } from '../interfaces/order-crm.interface';

@Injectable()
export class OrdersApiService {
  private readonly baseUrl: string;
   readonly urlOfOrder: string;
  constructor(private apiService: ApiCrmFetchService) {
    this.baseUrl = 'order';
    this.urlOfOrder = `${this.baseUrl}?include=shipping.deliveryService,products.offer,manager,custom_fields,payments,buyer`;
  }

  private async fetchDataAndMap(
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

  private async mapDto(dto: UpdateOrderDto): Promise<OrderCrmDto> {
   try {     
    const crmDto: OrderCrmDto = {
      source_id: dto.source_id,
      manager_id: dto.manager_id,
      status_id: dto.status_id,
      buyer: {
        full_name: dto.buyer.full_name,
        phone: dto.buyer.phones[0],
      },
      shipping: {},
      products: dto.products || [],
      payments: dto.payments
        ? [
            {
              id: '2',
              payment_method: 'Банківська картка',
              amount: dto.payments.value.toString(),
              status: 'paid',
            },
          ]
        : [],
      custom_fields: [
        {
          uuid: 'OR_1001',
          value: dto.notes?.toString() || '',
        },
        {
          uuid: 'OR_1002',
          value: dto.additionalnformation || '',
        },
      ],
    };
    if (!crmDto) throw new BadRequestException('Помилка') 
    return crmDto;
  } catch (error) {
    throw error;
  }
  }

  async getOrders() {
    const dataOrders = await this.apiService.get(
      `${this.urlOfOrder}`,
    );
    return dataOrders;
  }

  async getAll(): Promise<OrderCrm[]> {
    try {
      const orders: OrderCrm[] = [];
      let responseData;
      let currentPage = 1;
      const delayBetweenRequests = 1500;
      let requestCount = 0;
      do {
        responseData = await new Promise((resolve) => {
          setTimeout(async () => {
            requestCount++;
            console.log(`Запит ${requestCount}: Виконано`);

            const data: OrderCrm = await this.apiService.get(
              `${this.urlOfOrder}`,
              {
                limit: 50,
                page: currentPage,
              },
            );
            resolve(data);
          }, delayBetweenRequests);
        });
        orders.push(responseData);
        currentPage++;
      } while (currentPage <= responseData.last_page);

      return orders;
    } catch (error) {
      throw error;
    }
  }

  async getOrderById(id: string) {
    const order = await this.apiService.get(
      `order/${id}?include=shipping.deliveryService,products.offer,manager,custom_fields,payments,buyer`,
    );
    return order;
  }

  async createOrder(dto: Partial<OrderDto>): Promise<OrderCrm> {
    try {
      const crmDto = await this.mapDto(dto);
      const newOrder = await this.apiService.post(`${this.baseUrl}`, crmDto);
      if (!newOrder) {
        throw new BadRequestException('Помилка при створенні замовленняв СРМ');
      }
      return newOrder;
    } catch (error) {
      throw error;
    }
  }

  async updateOrder(id: string, dto: UpdateOrderDto) {
    try {
      const crmData = await this.mapDto(dto);
      const updateOrder = await this.apiService.put(
        `${this.baseUrl}/${id}`,
        crmData,
      );
      return updateOrder;
    } catch (error) {
      throw error;
    }
  }

  async getOrderStatus(): Promise<OrderStatusCrm[]> {
    const statuses = await this.apiService.get(`${this.baseUrl}/status`, {
      limit: 50,
    });
    return statuses.data;
  }

  async getDeliveryService(): Promise<OrderAssociations[]> {
    return this.fetchDataAndMap('delivery-service', { limit: 50 });
  }

  async getTag(): Promise<TTag[]> {
    const tags = await this.apiService.get(`${this.baseUrl}/tag`);
    return tags.data;
  }

  async getSource(): Promise<OrderAssociations[]> {
    return await this.fetchDataAndMap('source', { limit: 50 });
  }

  async getCustomField(): Promise<OrderAssociations[]> {
    const fields = await this.apiService.get('custom-fields');
    const response = fields.map((field) => ({
      id: field.id,
      value: field.name,
      uuid: field.uuid,
    }));
    return response;
  }

  async getPayment(): Promise<OrderAssociations[]> {
    return this.fetchDataAndMap('payment-method');
  }
}
