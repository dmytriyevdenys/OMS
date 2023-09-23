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

@Injectable()
export class BuyerService {
  constructor(@InjectModel(Buyer.name) private buyerModel: Model<Buyer>) {}

  async validateBuyer(dto: BuyerDto) {
    try {
      const phone = dto.phone;
      const buyer = await this.buyerModel.findOne({ phone: { $in: phone } });
      if (buyer) {
        if (buyer.full_name === dto.full_name) {
          throw new ConflictException('покупець вже існує');
        }
        return buyer;
      }
    } catch (error) {
      throw new BadRequestException(error.message);
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

  async createBuyer(dto: BuyerDto): Promise<Buyer> {
    try {
      const buyer = await this.validateBuyer(dto);

      if (!buyer) {
        const newBuyer = await this.buyerModel.create(dto);
        return newBuyer;
      }
    } catch (error) {
      throw new BadRequestException(
        'Не вдалось створити покупця',
        error.message,
      );
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
