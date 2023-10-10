import { Controller, Delete, Get, Put, Param, Query } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { BuyerDto } from './dto/buyer.dto';
import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { BuyerEntity } from './entities/buyer.entity';

@Controller('buyer')
export class BuyerController {
  constructor(private buyerService: BuyerService) {}

  @Get()
  async findBuyer(@Query('buyer') buyer: string): Promise<BuyerEntity[]> {
    if (buyer) return await this.buyerService.findBuyer(buyer);

    return await this.buyerService.getAllBuyer();
  }

  @Get(':id')
  async getById(@Param('id') id: number): Promise<BuyerEntity> {
    return await this.buyerService.findBuyerById(id);
  }

  @Put(':id')
  async updateBuyer(@Param('id') id: number, @Body() dto: BuyerDto): Promise<BuyerDto> {
    return await this.buyerService.updateBuyer(id, dto);
  }

  @Post()
  async createBuyer(@Body() dto: BuyerDto): Promise<BuyerEntity> {
    return await this.buyerService.createBuyer(dto);
  }

  @Delete(':id')
  async removeBuyer(@Param('id') id: number) {
     return this.buyerService.removeBuyer(id)
  }
}
