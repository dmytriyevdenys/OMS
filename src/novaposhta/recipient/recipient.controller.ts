import { Body, Controller, Post } from "@nestjs/common";
import { RecipientDto } from "./dto/recipient.dto";
import { RecipientService } from "./recipient.service";

@Controller()
export class RecipientController {
    constructor(
        private recipientService: RecipientService
    ) {}

    @Post('recipient')
    async crecreateRecipientate (@Body() dto: RecipientDto){
        return this.recipientService.createRecipient(dto);
    }
}