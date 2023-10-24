import { Injectable } from '@nestjs/common';
import { SenderService } from '../sender/sender.service';
import { OrderEntity } from 'src/orders/entities/order.entity';

@Injectable()
export class ApiKeyService {
  private apiKey: string;

  constructor(private senderService: SenderService) {}

  async getApiKey(order?: OrderEntity): Promise<string> {
    
    if (!order) {
      const { apiKey } = await this.senderService.getDefaultSender();
      this.apiKey = apiKey;
    } else if (order.sender) {
      const apiKey = order.sender.apiKey;
      this.apiKey = apiKey;
    }
    console.log(this.apiKey);
    
    return this.apiKey;
  }
    
  
}
