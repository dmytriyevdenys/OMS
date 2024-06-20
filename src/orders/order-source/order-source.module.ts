import { Module } from '@nestjs/common';
import { OrderSourceController } from './order-source.controller';
import { OrderSourceService } from './order-source.service';

@Module({
  controllers: [OrderSourceController],
  providers: [OrderSourceService]
})
export class OrderSourceModule {}
