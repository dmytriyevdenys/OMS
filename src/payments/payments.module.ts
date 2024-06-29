import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethodEntity } from './entities/payment-method.entity';
import { PaymentEntity } from './entities/payment.entity';
import { ResponseService } from 'src/utils/response.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethodEntity, PaymentEntity])],
  controllers: [PaymentsController],
  providers: [PaymentsService, ResponseService],
  exports:[TypeOrmModule, PaymentsService]
})
export class PaymentsModule {}
