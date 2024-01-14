import {
  Controller,
  Get,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import { ApiAddressService } from './api-service/novaposhta-api-address.service';
import { WareHouseDto } from './dto/warehouse.dto';

@Controller('address')
export class AddressController {
  constructor(
    private readonly apiAddressService: ApiAddressService,
  ) {}

  @Post('create')
 async create(@Body()dto: WareHouseDto ) {
    return await this.apiAddressService.createAddress(dto);
  }

  @Get('city')
  async getCities(@Query('name') city: string) {
    return await this.apiAddressService.getCities(city);
  }

  @Get('warehouse')
  async getWarehouse(@Query('ref') ref: string, @Query('number') id: string) {
    return await this.apiAddressService.getWarehouse(ref, id);
  }
  
  @Get('settlement')
  async getSettlements(@Query('name') name: string) {
    return await this.apiAddressService.getSettlements(name);
  }

  @Get('street')
  async getStreet(@Query('ref') ref: string, @Query('name') name: string) {
    return await this.apiAddressService.getStreets(ref, name);
  }

 
}
