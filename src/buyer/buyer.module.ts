import { Module } from '@nestjs/common';
import { BuyerController } from './buyer.controller';
import { BuyerService } from './buyer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Buyer, BuyerSchema } from './schemas/buyer.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerEntity } from './entities/buyer.entity';
import { PhoneEntity } from './entities/phone.entity';
import { ResponseService } from 'src/utils/response.service';

@Module({
  imports: [

  MongooseModule.forFeature([{name: Buyer.name, schema: BuyerSchema}]),
  TypeOrmModule.forFeature([BuyerEntity,PhoneEntity])
  ],
  controllers: [BuyerController],
  providers: [BuyerService, ResponseService],
  exports:[MongooseModule, TypeOrmModule]
})
export class BuyerModule {}
