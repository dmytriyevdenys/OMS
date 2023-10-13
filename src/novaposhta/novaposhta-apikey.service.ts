import { Injectable } from '@nestjs/common';
import { SenderService } from './sender/sender.service';

@Injectable()
export class ApiKeyService {
  private apiKey: string;

  constructor(private senderService: SenderService) {}

  async getApiKey(order: Record<string, any> = {}): Promise<string> {
    if (!order) {
      const { apiKey } = await this.senderService.getDefaultSender();
      this.apiKey = apiKey;
    }
    const { idSender } = order;
    if (idSender) {
      const sender = await this.senderService.findSenderById(idSender);
      this.apiKey = sender.apiKey;
    }
    return this.apiKey;
  }
}
