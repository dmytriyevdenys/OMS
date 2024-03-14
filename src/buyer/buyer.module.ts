import { Module } from '@nestjs/common';
import { BuyerController } from './buyer.controller';
import { BuyerService } from './buyer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerEntity } from './entities/buyer.entity';
import { ResponseService } from 'src/utils/response.service';
import { BuyerRecipientEntity } from './entities/buyer-recipient.entity';

@Module({
  imports: [
  TypeOrmModule.forFeature([BuyerEntity, BuyerRecipientEntity])
  ],
  controllers: [BuyerController],
  providers: [BuyerService, ResponseService],
  exports:[TypeOrmModule]
})
export class BuyerModule {}
