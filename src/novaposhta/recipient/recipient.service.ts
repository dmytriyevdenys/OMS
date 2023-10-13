import { Injectable } from '@nestjs/common';
import { ApiNovaposhtaFetchService } from 'src/utils/api-novaposhta-fetch.service';
import { MatchService } from 'src/utils/match-model.service';
import { RecipientDto } from './dto/recipient.dto';
import { CalledMethod, ModelName } from 'src/consts/consts';
import { SenderService } from '../sender/sender.service';

@Injectable()
export class RecipientService {
  constructor(
    private apiService: ApiNovaposhtaFetchService,
    private matchService: MatchService,
    private senderService: SenderService,
  ) {}

  async createRecipient(dto: RecipientDto) {
    try {
      const { apiKey } = await this.senderService.getDefaultSender();
      const modelName = ModelName.Counterparty;
      const calledMethod = CalledMethod.save;
      const methodProperties = dto;

      const response = await this.apiService.sendPostRequest(
        apiKey,
        modelName,
        calledMethod,
        methodProperties,
      );

      const data = response.data;
      return data;

    } catch (error) {}
  }

  async createRecipientOrganization (edrpou : {EDRPOU: string}){
     try {
        const { apiKey } = await this.senderService.getDefaultSender();
      const modelName = ModelName.Counterparty;
      const calledMethod = CalledMethod.save;
      const methodProperties = {
        CounterpartyType : 'Organization',
        EDRPOU: edrpou,
        CounterpartyProperty: 'Recipient'
      }
      const response = await this.apiService.sendPostRequest(
        apiKey,
        modelName,
        calledMethod,
        methodProperties,
      );

      const data = response.data;
      return data;
     }
     catch(error) {

     }
  }
}
