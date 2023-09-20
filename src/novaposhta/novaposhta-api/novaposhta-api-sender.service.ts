import { Injectable } from '@nestjs/common';
import { CalledMethod, ModelName } from 'src/consts/consts';
import { ApiNovaposhtaFetchService } from 'src/utils/api-novaposhta-fetch.service';
import {  Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Sender } from '../schemas/sender.schema';
import { SenderContact } from '../schemas/sender-contact.schema';
import {  MatchModelService } from 'src/utils/match-model.service';

@Injectable()
export class ApiSenderService {
  constructor(
    private apiService: ApiNovaposhtaFetchService,
    private matchSercive: MatchModelService,
    @InjectModel(Sender.name) private readonly senderModel: Model<Sender>,
  ) {}

  async getCounterparties(apiKey: { apiKey: string }){
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
      throw new Error(`Error in getCounterparties: ${error.message}`);
    }
  }

  async getCounterpartyContactPersons(
    apiKey: { apiKey: string },
    ref: string,
  ): Promise<SenderContact> {
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
        `Error in getCounterpartyContactPersons: ${error.message}`
      );
    }
  }

  async getNewSender(apiKey: { apiKey: string }): Promise<Sender> {
    try {
      const senderData = await this.getCounterparties(apiKey);
      const ref = senderData.Ref;
      const senderContact = await this.getCounterpartyContactPersons(
        apiKey,
        ref,
      );
      const senderDto = {
        ...senderData,
        Contact: senderContact,
      };

      return this.matchSercive.match(this.senderModel, senderDto);
    } catch (error) {
      throw new Error(`Error in newSender: ${error.message}`);
    }
  }
}
