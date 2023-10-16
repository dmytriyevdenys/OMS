import { Controller, Get, Post, Body, Delete, Query, Put } from '@nestjs/common';
import { ApiSenderService } from './novaposhta-api/novaposhta-api-sender.service';
import { SenderDto } from './sender/dto/sender.dto';
import { SenderService } from './sender/sender.service';
import { ApiAddressService } from './novaposhta-api/novaposhta-api-address.service';
import { WareHouseDto } from './address/dto/warehouse.dto';


@Controller('novaposhta')
export class NovaposhtaController {
  constructor(
  ) {}

 
}
