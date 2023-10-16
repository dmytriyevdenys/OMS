import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiSenderService } from '../novaposhta-api/novaposhta-api-sender.service';
import { SenderService } from './sender.service';
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


  @Get()
  async getAll(): Promise<SenderEntity[]> {
    return this.senderService.getAllSender();
  }

  @Get(':id')
  async getById (@Param('id') id: number): Promise<SenderEntity> {
    return await this.senderService.findSenderById(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number){
    return this.senderService.deleteSender(id);
  }

  @Post('default/:id')
  async setDefault(@Param('id') id: number): Promise<SenderEntity>{
    return this.senderService.setDefaultSender(id);
  }

  @Get('default')
  async getDefault(): Promise<SenderEntity> {
    return this.senderService.getDefaultSender();
  }
}
