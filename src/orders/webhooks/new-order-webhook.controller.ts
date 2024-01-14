import { Body, Controller, Post } from "@nestjs/common";
import { NewOrderWebHookService } from './new-order-webhook.service';

@Controller ('webhooks')
export class NewOrderWebHookController {
    constructor( 
        private newOrderWebHookService:NewOrderWebHookService
    ) {}

    @Post()
    async newOrderWebHook (@Body() data: any) {
       const response =  await this.newOrderWebHookService.newOrderFromWebHook(data)

       
       return response
    }
}