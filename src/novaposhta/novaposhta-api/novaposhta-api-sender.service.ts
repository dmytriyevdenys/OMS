import { Injectable } from '@nestjs/common';
import { CalledMethod, ModelName } from 'src/consts/consts';
import { ApiNovaposhtaFetchService } from 'src/utils/api-novaposhta-fetch.service';

@Injectable()
export class ApiSenderService {
  constructor(private apiService: ApiNovaposhtaFetchService) {}

  async getCounterparties(apiKey: { apiKey: string }) {
    try {
      const key = apiKey.apiKey;
      const modelName = ModelName.Counterparty;
      const calledMethod = CalledMethod.getCounterparties;
      const methodProperties = {
        CounterpartyProperty: 'Sender',
      };
      const response = await this.apiService.sendPostRequest(
        key,
        modelName,
        calledMethod,
        methodProperties,
      );
      const data = response.data[0];
      return { data, key };
    } catch (error) {
      throw new Error(`Error in getCounterparties: ${error.message}`);
    }
  }

  async getCounterpartyContactPersons(apiKey: { apiKey: string }, ref: string) {
    try {
      const key = apiKey.apiKey;
      const modelName = ModelName.Counterparty;
      const calledMethod = CalledMethod.getCounterpartyContactPersons;
      const methodProperties = {
        Ref: ref,
      };
      const response = await this.apiService.sendPostRequest(
        key,
        modelName,
        calledMethod,
        methodProperties,
      );
      const data = response.data;
      return data;
    } catch (error) {
      throw new Error(`Error in getCounterpartyContactPersons: ${error.message}`);
    }
  }

  async newSender(apiKey: { apiKey: string }) {
    try {
      const senderData = await this.getCounterparties(apiKey);
      const ref = senderData.data.Ref;
      const SenderIfo = senderData.data
      const senderContact = await this.getCounterpartyContactPersons(apiKey, ref);
      const sender = { SenderIfo, senderContact };
      return sender;
    } catch (error) {
      throw new Error(`Error in newSender: ${error.message}`);
    }
  }
}
