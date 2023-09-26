import { Module } from '@nestjs/common';
import { BuyerController } from './buyer.controller';
import { BuyerService } from './buyer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Buyer, BuyerSchema } from './schemas/buyer.schema';

@Module({
  imports: [

  MongooseModule.forFeature([{name: Buyer.name, schema: BuyerSchema}]),
  ],
  controllers: [BuyerController],
  providers: [BuyerService],
  exports:[MongooseModule]
})
export class BuyerModule {}
