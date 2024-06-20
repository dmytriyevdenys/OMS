import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiSenderService } from './api-service/novaposhta-api-sender.service';
import { SenderService } from './sender.service';
import { SenderDto } from './dto/sender.dto';
import { SenderEntity } from './entities/sender.entity';
import { AddressDto } from '../address/dto/address.dto';
import { UpdateAddressDto } from '../address/dto/update-address.dto';

@Controller('sender')
export class SenderController {
  constructor(
    private readonly senderService: SenderService,
    private readonly apiSenderServise: ApiSenderService,
  ) {}
  @Post()
  async getNewSender(@Body() key: { apiKey: string }) {
    return this.apiSenderServise.getNewSender(key);
  }

  @Post('create')
  async createNewSender(@Body() dto: SenderDto): Promise<SenderEntity>{
    return await this.senderService.createSender(dto);
  }
  @Post('default/:id')
  async setDefault(@Param('id') id: number): Promise<SenderEntity>{
    return this.senderService.setDefaultSender(id);
  }

  @Get('default')
  async getDefault(): Promise<SenderEntity> {
    return this.senderService.getDefaultSender();
  }


  @Get()
  async getAll(): Promise<SenderEntity[]> {
    return this.senderService.getAllSender();
  }

  @Get(':id')
  async getById (@Param('id') id: number): Promise<SenderEntity> {
    return await this.senderService.findSenderById(id);
  }

  @Post(':id/address')
  async addAddress (@Param('id') id: number, @Body() dto: AddressDto): Promise<SenderEntity> { 
    return await this.senderService.addAddress(id, dto);
  }

  @Put(':id/address')
  async updateAddress(@Param('id') id: number, @Body() dto: UpdateAddressDto){
    return await this.senderService.updateAddress(id, dto);
  }

  @Delete(':id/address')
  async removeAddress(@Param('id') id: number, @Body() idAdress: {id: number} ){
    return await this.senderService.removeAddress(id, idAdress.id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number){
    return this.senderService.deleteSender(id);
  }


}
