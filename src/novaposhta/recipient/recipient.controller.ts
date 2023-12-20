import { Body, Controller, Post } from "@nestjs/common";
import { RecipientDto } from "./dto/recipient.dto";
import { RecipientApiService } from "./api-service/recipient-api.service";

@Controller()
export class RecipientController {
    constructor(
        private recipientApiService: RecipientApiService
    ) {}

    @Post('recipient')
    async crecreateRecipientate (@Body() dto: RecipientDto){
        return await this.recipientApiService.createRecipient(dto);
    }
}