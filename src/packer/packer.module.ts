import { Module } from '@nestjs/common';
import { PackerController } from './packer.controller';
import { PackerService } from './packer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackerEntity } from './entities/packer.entity';
import { ResponseService } from 'src/utils/response.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([PackerEntity])
    ],
    providers: [PackerService, ResponseService],
    controllers: [PackerController],
    exports: [TypeOrmModule]
})
export class PackerModule {}
