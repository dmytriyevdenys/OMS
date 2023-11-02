import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { PackerService } from './packer.service';
import { CreatePackerDto } from './dto/create-packer.dto';

@Controller('packer')
export class PackerController {
    constructor (
        private readonly packerService: PackerService
    ) {}

   @Get()
   async getAll () { 
    return await this.packerService.getAllPacker();
   } 

   @Get(':id')
   async getById (@Param('id') id: number, @Query('include') query: string) { 
    return await this.packerService.getPackerById(id, query);
   }

   @Delete(':id')
   async removePacker (@Param('id') id: number) {
    return await this.packerService.removePacker(id);
   }

   @Post()
   async createPacker(@Body() dto: CreatePackerDto) {
    return await this.packerService.createPacker(dto);
   }

   @Post(':id/scan/:number')
   async addIntDoc(@Param('id') id: number,@Param('number') number: string) { 
    return await this.packerService.addIntDocToPacker(id, number)
   }
}
