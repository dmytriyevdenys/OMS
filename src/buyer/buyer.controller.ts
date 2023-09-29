import { Controller, Delete, Get, Put, Param } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { BuyerDto } from './dto/buyer.dto';
import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Buyer } from './schemas/buyer.schema';

@Controller('buyer')
export class BuyerController {
    constructor(
        private buyerService: BuyerService
    ){}

    @Get()
    async getAll (): Promise<Buyer[]> {
        return this.buyerService.getAllBuyer();
    }

    @Get(':id')
    async getById (@Param('id') id: string) {
        return this.buyerService.findBuyerById(id);
    }

    @Post()
    async createBuyer (@Body() dto: BuyerDto[]): Promise<Buyer[]> {
        return this.buyerService.createBuyer(dto);
    }

    @Put()
    async updateBuyer (@Body() dto: BuyerDto): Promise<Buyer> {
        return this.buyerService.updateBuyer(dto);
    }

    @Delete()
    async removeBuyer (@Body() id: {id: string}) {
        return this.buyerService.removeBuer(id)
    }
}
