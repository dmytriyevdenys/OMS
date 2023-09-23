import { Injectable } from '@nestjs/common';
import { ApiNovaposhtaFetchService } from 'src/utils/api-novaposhta-fetch.service';
import { MatchModelService } from 'src/utils/match-model.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SenderService } from '../novaposhta-sender.service';
import { CalledMethod, ModelName } from 'src/consts/consts';
import { WareHouseDto } from '../dto/warehouse.dto';
import { Address } from '../schemas/address.schema';

@Injectable()
export class ApiAddressService {
  constructor(
    private apiService: ApiNovaposhtaFetchService,
    private matchSercive: MatchModelService,
    private senderService: SenderService,
    @InjectModel(Address.name) private readonly addressModel: Model<Address>,
  ) {}

  async getCities(city: string): Promise<WareHouseDto> {
    try {
      const { apiKey } = await this.senderService.getDefaultSender();
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

  async getWarehouse(dto: WareHouseDto): Promise<Address[]> {
    const { apiKey } = await this.senderService.getDefaultSender();
    const modelName = ModelName.Address;
    const calledMethod = CalledMethod.getWarehouses;
    const methodProperties = {
      CityRef: dto.CityRef,
      WarehouseId: dto.WarehouseId,
    };
    const response = await this.apiService.sendPostRequest(
      apiKey,
      modelName,
      calledMethod,
      methodProperties,
    );
    const data = response.data;
    const addressData = await Promise.all(
      data.map((addressData: any) => {
        return this.matchSercive.match(this.addressModel, addressData);
      }),
    );
    return addressData;
  }

  async createAddress(dto: WareHouseDto): Promise<Address> {
    const { apiKey } = await this.senderService.getDefaultSender();
    const modelName = ModelName.Address;
    const calledMethod = CalledMethod.save;
    const methodProperties = {
      CityRef: dto.CityRef,
      WarehouseRef: dto.WarehouseRef,
    };

    try {
      const response = await this.apiService.sendPostRequest(
        apiKey,
        modelName,
        calledMethod,
        methodProperties,
      );
      const data = response.data;
      return data;
    } catch (error) {
     
    }
  }
}
