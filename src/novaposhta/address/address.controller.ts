import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressDto } from './dto/address.dto';
import { ApiAddressService } from '../novaposhta-api/novaposhta-api-address.service';
import { WareHouseDto } from './dto/warehouse.dto';

@Controller('address')
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
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
  async getWarehouse(@Query('ref') ref: string, @Query('id') id: string) {
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
