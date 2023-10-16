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

@Controller('address')
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
    private readonly apiAddressService: ApiAddressService,
  ) {}

  @Post('create')
  create(@Query('cityRef') citRef: string, @Query('ref') ref: string) {
    return this.apiAddressService.createAddress(citRef, ref);
  }

  @Get('city')
  async getCities(@Query('name') city: string) {
    return await this.apiAddressService.getCities(city);
  }

  @Get('warehouse')
  async getWarehouse(@Query('ref') ref: string, @Query('id') id: string) {
    return await this.apiAddressService.getWarehouse(ref, id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressService.remove(+id);
  }
}
