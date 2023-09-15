import { Controller, Get, Post, Body, Request } from '@nestjs/common';
import { ApiSenderService } from './novaposhta-api/novaposhta-api-sender.service';
import { Public } from 'src/decorators/public.decorator';


@Controller('novaposhta')
export class NovaposhtaController {
    constructor(
        private apiSenderService: ApiSenderService
    ){}
   
    @Post('sender')
    async getCounterparties(@Body() key: {apiKey: string}) {
        
        return this.apiSenderService.newSender(key)
    } 
}
