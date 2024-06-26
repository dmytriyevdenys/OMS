import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatusEntity } from './entities/order-status.entity';

@Injectable()
export class OrderStatusService {
    constructor (
        @InjectRepository(OrderStatusEntity)
        private readonly statusRepository: Repository<OrderStatusEntity>
    ) {}

  async getAllStatuses () { 
    try {
      const statuses = await this.statusRepository.find();
      return statuses
    } catch (error) { 
      throw error;
    }
  }

  async getStatusesForOrderBoard(ids: number[]) {
    try {
      const statuses = await this.statusRepository
        .createQueryBuilder('status')
        .where('status.id IN (:...ids)', { ids })
        .getMany();
      if (!statuses) throw new BadRequestException('Не знайдено жодно статуса');
      return statuses;
    } catch (error) {
      throw error;
    }
  }
}
