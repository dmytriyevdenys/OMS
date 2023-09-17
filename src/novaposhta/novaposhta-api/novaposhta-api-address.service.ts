import { Injectable } from '@nestjs/common';
import { ApiNovaposhtaFetchService } from 'src/utils/api-novaposhta-fetch.service';
import { MatchModelService } from 'src/utils/match-model.service';
import { Sender } from '../schemas/sender.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SenderService } from '../novaposhta-sender.service';
import { CalledMethod, ModelName } from 'src/consts/consts';

@Injectable()
export class ApiAddressService {
  constructor(
    private apiService: ApiNovaposhtaFetchService,
    private matchSercive: MatchModelService,
    private senderService: SenderService,
    @InjectModel(Sender.name) private readonly senderModel: Model<Sender>,
  ) {}

  async getCities (city: string) {
    try {
        const {apiKey} = await this.senderService.getDefaultSender();
        const modelName = ModelName.Address;
        const calledMethod= CalledMethod.getCities;
        const methodProperties = {
            FindByString: city
        };
        const response = await this.apiService.sendPostRequest(
            apiKey,
            modelName,
            calledMethod,
            methodProperties
        );
        const data = response.data; 
        
        return data;
    
    }  catch (error) {
        throw new Error ( `Erro in getCities: ${error.message} `);
    }
  }
}
