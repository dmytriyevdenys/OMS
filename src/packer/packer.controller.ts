import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { PackerService } from './packer.service';
import { CreatePackerDto } from './dto/create-packer.dto';
import { ScanIntDocDto } from 'src/packer/dto/scan-int-doc.dto';

@Controller('packer')
export class PackerController {
  constructor(private readonly packerService: PackerService) {}

  @Get()
  async getAll() {
    return await this.packerService.getAllPacker(); 
  }

  @Get(':id')
  async getById(@Param('id') id: number, @Query('include') query: string) {
    return await this.packerService.getPackerById(id, query);
  }

  @Post(':id')
  async checkPacker(
    @Param('id', ParseIntPipe) id: number,
    @Body() password: { password: string },
  ) {
    return this.packerService.checkPacker(id, password.password);
  }

  @Delete(':id')
  async removePacker(@Param('id') id: number) {
    return await this.packerService.removePacker(id);
  }

  @Post()
  async createPacker(@Body() dto: CreatePackerDto) {
    return await this.packerService.createPacker(dto);
  }

  @Post(':id/scan')
  async scanIntoc(@Param('id') id: number, @Body() dto: ScanIntDocDto) {
    return await this.packerService.scanIntDoc(id, dto);
  }
}
