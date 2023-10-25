import { Injectable } from '@nestjs/common';
import { SenderService } from '../sender/sender.service';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { SenderEntity } from '../sender/entities/sender.entity';

@Injectable()
export class ApiKeyService {
  private apiKey: string;

  constructor(private senderService: SenderService) {}

  async getApiKey(sender?: SenderEntity): Promise<string> {
    
    if (!sender) {
      const { apiKey } = await this.senderService.getDefaultSender();
      this.apiKey = apiKey;
    } else if (sender.id) {
      
      const {apiKey} = await this.senderService.findSenderById(sender.id)
      this.apiKey = apiKey;
    }
    return this.apiKey;
  }
    
  
}
