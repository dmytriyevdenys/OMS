import { Injectable } from '@nestjs/common';
import { ApiNovaposhtaFetchService } from 'src/utils/api-novaposhta-fetch.service';
import { CalledMethod, ModelName } from 'src/consts/consts';
import { WareHouseDto } from '../address/dto/warehouse.dto';
import { MatchService } from 'src/utils/match-model.service';
import { AddressEntity } from '../address/entities/address.entity';
import { ApiKeyService } from '../novaposhta-apikey.service';

@Injectable()
export class ApiAddressService {
  constructor(
    private apiService: ApiNovaposhtaFetchService,
    private matchService: MatchService,
    private readonly apiKeyService: ApiKeyService
  ) {}

  async getCities(city: string): Promise<WareHouseDto> {
    try {
      const  apiKey  = await this.apiKeyService.getApiKey();
      const modelName = ModelName.Address;
      const calledMethod = CalledMethod.getCities;
      const methodProperties = {
        FindByString: city,
      };
      const response = await this.apiService.sendPostRequest(
        apiKey,
        modelName,
        calledMethod,
        methodProperties,
      );
      const data = response.data;
      const citysData = data.map((city: any) => ({
        Description: `${city.SettlementTypeDescription} ${city.Description} ${city.AreaDescription} обл`,
        Ref: city.Ref,
      }));

      return citysData;
    } catch (error) {
      throw new Error(`Error in getCities: ${error.message} `);
    }
  }

  async getWarehouse(ref: string, id: string){
    
    const  apiKey  = await this.apiKeyService.getApiKey();
    const modelName = ModelName.Address;
    const calledMethod = CalledMethod.getWarehouses;
    const methodProperties = {
      CityRef: ref,
      WarehouseId: id,
    };
    const response = await this.apiService.sendPostRequest(
      apiKey,
      modelName,
      calledMethod,
      methodProperties,
    );
    const data = response.data;
    const warehouse = await this.matchService.mapToEntity(AddressEntity, data);
    return warehouse;
  }

  async createAddress(cityRef: string, ref: string){
    const  apiKey  = await this.apiKeyService.getApiKey();
    const modelName = ModelName.Address;
    const calledMethod = CalledMethod.save;
    const methodProperties = {
      CityRef: cityRef,
      WarehouseRef: ref,
    };
    console.log(methodProperties);
    
    try {
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
}
