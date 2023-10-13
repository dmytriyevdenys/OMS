import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiSenderService } from '../novaposhta-api/novaposhta-api-sender.service';
import { SenderService } from './sender.service';
import { Sender } from '../schemas/sender.schema';
import { SenderDto } from './dto/sender.dto';
import { SenderEntity } from './entities/sender.entity';

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

  @Put()
  async updateSenderAddress(@Body() dto: SenderDto) {
    return await this.senderService.updateSenderAddress(dto);
  }

  @Get()
  async getAll(): Promise<SenderEntity[]> {
    return this.senderService.getAllSender();
  }

  @Delete()
  async delete(@Body() id: { id: string }): Promise<Sender> {
    return this.senderService.deleteSender(id);
  }

  @Post('default')
  async setDefault(@Body() id: { id: string }): Promise<Sender> {
    return this.senderService.setDefaultSender(id);
  }

  @Get('default')
  async getDefault(): Promise<Sender> {
    return this.senderService.getDefaultSender();
  }
}
