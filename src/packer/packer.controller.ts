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
import { Public } from 'src/decorators/public.decorator';
import { PackerEntity } from './entities/packer.entity';
import { ScanIntDocDto } from 'src/packer/dto/scan-int-doc.dto';

@Controller('packer')
export class PackerController {
  constructor(private readonly packerService: PackerService) {}

  @Public()
  @Get()
  async getAll() {
    return await this.packerService.getAllPacker(); 
  }

  @Public()
  @Get(':id')
  async getById(@Param('id') id: number, @Query('include') query: string) {
    return await this.packerService.getPackerById(id, query);
  }

  @Public()
  @Post(':id')
  async checkPacker(
    @Param('id', ParseIntPipe) id: number,
    @Body() password: { password: string },
  ) {
    return this.packerService.checkPacker(id, password.password);
  }

  @Public()
  @Delete(':id')
  async removePacker(@Param('id') id: number) {
    return await this.packerService.removePacker(id);
  }

  @Public()
  @Post()
  async createPacker(@Body() dto: CreatePackerDto) {
    return await this.packerService.createPacker(dto);
  }

  @Public()
  @Post(':id/scan')
  async scanIntoc(@Param('id') id: number, @Body() dto: ScanIntDocDto) {
    return await this.packerService.scanIntDoc(id, dto);
  }
}
