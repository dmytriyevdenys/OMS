import { Injectable, OnModuleInit } from "@nestjs/common";
import { SenderService } from "./novaposhta-sender.service";

@Injectable()
export class ApiKeyService  {
  private apiKey: string;

  constructor(private senderService: SenderService) {

  }



  getApiKey(): string {
    if (!this.apiKey) {
      throw new Error(`ApiKey is not initialized.`);
    }
    return this.apiKey;
  }
}
