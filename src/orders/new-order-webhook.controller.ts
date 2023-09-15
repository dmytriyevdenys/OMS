import { Body, Controller, Post } from "@nestjs/common";
import { Public } from "src/decorators/public.decorator";
import { NewOrderWebHookService } from './new-order-webhook.service';

@Controller ('webhooks')
export class NewOrderWebHookController {
    constructor( 
        private newOrderWebHookService:NewOrderWebHookService
    ) {}

    @Public()
    @Post()
    async newOrderWebHook (@Body() data: any) {
       const response =  await this.newOrderWebHookService.newOrderFromWebHook(data)
       console.log(response);
       
       return response
    }
}