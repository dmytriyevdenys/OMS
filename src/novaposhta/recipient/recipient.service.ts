import { Injectable } from '@nestjs/common';
import { ApiNovaposhtaFetchService } from 'src/utils/api-novaposhta-fetch.service';
import { MatchService } from 'src/utils/match-model.service';
import { RecipientDto } from './dto/recipient.dto';
import { CalledMethod, ModelName } from 'src/consts/consts';
import { SenderService } from '../sender/sender.service';
import { ApiKeyService } from '../novaposhta-apikey.service';
import { RecipientInterface } from './interfaces/recipient.interface';

@Injectable()
export class RecipientService {
  constructor(
    private apiService: ApiNovaposhtaFetchService,
    private matchService: MatchService,
    private senderService: SenderService,
    private readonly apiKeyService: ApiKeyService
  ) {}

  async createRecipient(dto: RecipientDto): Promise<RecipientInterface> {
    try {
      const  { apiKey }  = await this.senderService.getDefaultSender();
            
      const modelName = ModelName.Counterparty;
      const calledMethod = CalledMethod.save;
      const methodProperties = {
        ...dto,
        CounterpartyType: 'PrivatePerson',
        CounterpartyProperty: 'Recipient'
      };

      const response = await this.apiService.sendPostRequest(
        apiKey,
        modelName,
        calledMethod,
        methodProperties,
      );
        
      const data: RecipientInterface = response.data;
      return data[0];

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
