import { Module } from '@nestjs/common';
import { OrderStatusService } from './order-status.service';
import { OrderStatusController } from './order-status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderStatusEntity } from './entities/order-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderStatusEntity])],
  controllers: [OrderStatusController],
  providers: [OrderStatusService],
  exports: [TypeOrmModule]
})
export class OrderStatusModule {}
