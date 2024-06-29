import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethodEntity } from './entities/payment-method.entity';
import { Repository } from 'typeorm';
import { ResponseService } from 'src/utils/response.service';
import { ResponseData } from 'src/interfaces/response-data.interface';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentMethodEntity)
    private readonly paymentMethodRepository: Repository<PaymentMethodEntity>,
    private readonly responseService: ResponseService,
  ) {}

  async getPaymentMethods(): Promise<ResponseData<PaymentMethodEntity[]>> {
    try {
      const paymentMethods = await this.paymentMethodRepository.find();
      return this.responseService.successResponse(paymentMethods);
    } catch (error) {
      throw error;
    }
  }
}
