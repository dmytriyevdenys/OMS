import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Buyer } from './schemas/buyer.schema';
import { Model } from 'mongoose';
import { BuyerDto } from './dto/buyer.dto';
import { Order } from 'src/orders/schemas/order.schema';

@Injectable()
export class BuyerService {
  constructor(@InjectModel(Buyer.name) private buyerModel: Model<Buyer>) {}

  async validateBuyer(dto: BuyerDto) {
    try {
      const phones = dto.phone;
      for (const phone of phones) {
        const buyer = await this.buyerModel.findOne({ phone });
        if (buyer) {
          return buyer;
        }
      }
      return null;
    } catch (error) {
      throw new BadRequestException('помилка ', error.message);
    }
  }

  async getAllBuyer(): Promise<Buyer[]> {
    try {
      const buyers = await this.buyerModel.find().exec();

      if (!buyers) {
        throw new NotFoundException('Не вдалось знайти покупців');
      }
      return buyers;
    } catch (error) {
      throw new BadRequestException(
        'Не вдалось знайти покупців',
        error.message,
      );
    }
  }

  async findBuyerById(id: string): Promise<Buyer> {
    try {
      const buyer = await this.buyerModel.findById(id);
      if (!buyer) {
        throw new NotFoundException('покупець не існує');
      }
      return buyer;
    } catch (error) {
      throw new BadRequestException('invalid request', error.message);
    }
  }

  async findBayerbyName(name: string): Promise<Buyer> {
    try {
      const buyer = await this.buyerModel.findOne({ name });
      if (!buyer) {
        throw new NotFoundException('покупець не знайдений');
      }
      return buyer;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createBuyer(dto: BuyerDto[]): Promise<Buyer[]> {
    try {
      if (!dto) {
        return [];
      }

      const newBuyers = await Promise.all(
        dto.map(async (buyer) => {
          if (buyer.id) {
            return this.findBuyerById(buyer.id);
          }
          const existingBuyer = await this.validateBuyer(buyer);

          if (existingBuyer) {
            throw new ConflictException('Покупець вже існує');
          }

          const newBuyer = await this.buyerModel.create(buyer);

          if (!newBuyer) {
            throw new BadRequestException('Не вдалось створити покупця');
          }

          return newBuyer;
        }),
      );

      return newBuyers;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(
        'Помилка при створенні покупця',
        error.message,
      );
    }
  }

  async assignOrderToBuyers(buyers: Buyer[], order: Order): Promise<Buyer[]> {
    try {
      if (!buyers) {
        return [];
      }

      const updatedBuyers: Buyer[] = await Promise.all(
        buyers.map(async (buyer) => {
          if (order.buyer.length > 0) {
            const previusBuyers = order.buyer.filter(
              (orderBuyer) => orderBuyer.id !== buyer.id,
            )
                  
            if (previusBuyers.length > 0) {
              await Promise.all(
                previusBuyers.map(async (previuseBuyer) => {
                  await this.buyerModel.updateOne(
                    { _id: previuseBuyer.id },
                    { $unset: { orders: order.id } },
                  );
                }),
              );
            }
          }
          const newBuyer = await this.findBuyerById(buyer.id);
          newBuyer.orders.push(order._id);
          await newBuyer.save();
          return newBuyer;
        }),
      );

      return updatedBuyers;
    } catch (error) {
      console.error('Помилка при роботі з базою даних:', error);
      throw error;
    }
  }

  async updateBuyer(dto: BuyerDto) {
    try {
      if (!dto.id) {
        throw new BadRequestException(`поле id обов'язкове`);
      }
      const buyer = await this.findBuyerById(dto.id);

      if (!buyer) {
        return null;
      }

      const updatedBuyer = await this.buyerModel.findOneAndUpdate(
        { _id: buyer._id },
        { ...dto },
        { new: true },
      );

      return updatedBuyer;
    } catch (error) {
      throw new BadRequestException(
        'Не вдалось оновити покупця',
        error.message,
      );
    }
  }

  async removeBuer(id: { id: string }) {
    try {
      if (!id) {
        throw new BadRequestException(`поле id обов'язкове`);
      }
      const idBuyer = id.id;
      await this.buyerModel.findByIdAndRemove(idBuyer);
      return HttpStatus.ACCEPTED;
    } catch (error) {
      throw new BadRequestException(
        'не вдалось видалити користувача',
        error.message,
      );
    }
  }
}
