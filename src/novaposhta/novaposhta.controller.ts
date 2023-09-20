import { Controller, Get, Post, Body, Delete, Query, Put } from '@nestjs/common';
import { ApiSenderService } from './novaposhta-api/novaposhta-api-sender.service';
import { SenderDto } from './dto/sender.dto';
import { Sender } from './schemas/sender.schema';
import { SenderService } from './novaposhta-sender.service';
import { ApiAddressService } from './novaposhta-api/novaposhta-api-address.service';
import { WareHouseDto } from './dto/warehouse.dto';


@Controller('novaposhta')
export class NovaposhtaController {
  constructor(
    private apiSenderService: ApiSenderService,
    private senderService: SenderService,
    private apiAddressService: ApiAddressService,
  ) {}

  @Post('sender')
  async getCounterparties(@Body() key: { apiKey: string }) {
    return this.apiSenderService.getNewSender(key);
  }

  @Post('sender/create')
  async createNewSender(@Body() dto: SenderDto): Promise<Sender> {
    return await this.senderService.setSender(dto);
  }

  @Put('sender') 
  async updateSenderAddress (@Body() dto: SenderDto){
   return await this.senderService.updateSenderAddress(dto)
  }

  @Get('sender')
  async getAll(): Promise<Sender[]> {
    return this.senderService.getAllSender();
  }

  @Delete('sender')
  async delete(@Body() id: { id: string }): Promise<Sender> {
    return this.senderService.deleteSender(id);
  }

  @Post('sender/default')
  async setDefault(@Body() id: { id: string }): Promise<Sender> {
    return this.senderService.setDefaultSender(id);
  }

  @Get('sender/default')
  async getDefault (): Promise<Sender> {
    return this.senderService.getDefaultSender()
  }

  @Get('address')
  async getCity (@Query('city') city: string) {
    return  this.apiAddressService.getCities(city);
  }

  @Post('address')

  async getWarehouse(@Body() dto: WareHouseDto) {
    return this.apiAddressService.getWarehouse(dto);
  }

 
}
