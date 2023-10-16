import { BadRequestException, Injectable } from '@nestjs/common';
import { CalledMethod, ModelName } from 'src/consts/consts';
import { ApiNovaposhtaFetchService } from 'src/utils/api-novaposhta-fetch.service';
import { MatchService } from 'src/utils/match-model.service';
import { SenderEntity } from '../sender/entities/sender.entity';

@Injectable()
export class ApiSenderService {
  constructor(
    private apiService: ApiNovaposhtaFetchService,
    private matchSercive: MatchService,
  ) {}

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

      return data;
    } catch (error) {
      throw error;
    }
  }

  async getCounterpartyContactPersons(
    apiKey: { apiKey: string },
    ref: string,
  ){
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
      throw new Error(
        `Error in getCounterpartyContactPersons: ${error.message}`,
      );
    }
  }

  async getNewSender(apiKey: { apiKey: string }) {
    try {
      if (!apiKey.apiKey?.length)
        throw new BadRequestException(`Поле apiKey обо'язкове`);

      const senderData = await this.getCounterparties(apiKey);
      const ref = senderData.Ref;
      const senderContact = await this.getCounterpartyContactPersons(
        apiKey,
        ref,
      );

      const sender = await this.matchSercive.mapToEntity(
        SenderEntity,
        senderData,
      );
      const response = {
        ...sender,
        Contact: senderContact,
      };

      return response;
    } catch (error) {
      throw error;
    }
  }
}
