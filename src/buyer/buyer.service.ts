import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  HttpStatus,
} from '@nestjs/common';
import { BuyerDto } from './dto/buyer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BuyerEntity } from './entities/buyer.entity';
import { EntityManager, ILike, Repository } from 'typeorm';
import { ResponseService } from 'src/utils/response.service';

@Injectable()
export class BuyerService {
  constructor(
    @InjectRepository(BuyerEntity)
    private readonly buyerRepository: Repository<BuyerEntity>,
    private readonly entityManager: EntityManager,
    private readonly responseService: ResponseService
  ) {}

  async validateBuyer(phoneNumbers: string[]): Promise<BuyerEntity> {
    try {
      const buyers = await Promise.all(
        phoneNumbers.map(async (phone) => {
          return await this.buyerRepository
            .createQueryBuilder('buyer')
            .where('buyer.phones = :phone', { phone })
            .getOne();
        }),
      );
      const buyer = buyers.filter((buyer) => buyer !== null);
      return buyer[0];
    } catch (error) {
      throw new BadRequestException('Помилка: ' + error.message);
    }
  }

  async getAllBuyer(): Promise<BuyerEntity[]> {
    try {
      const buyers = await this.buyerRepository.find();

      if (!buyers) {
        this.responseService.notFoundResponse('Не вдалось знайти покупців');
      }
      return buyers;
    } catch (error) {
      throw new BadRequestException(
        'Не вдалось знайти покупців',
        error.message,
      );
    }
  }

  async findBuyerById(id: number): Promise<BuyerEntity> {
    try {
      const buyer = await this.buyerRepository.findOne({ where: {id}, relations: {orders: true} });
      if (!buyer) {
        // throw new NotFoundException('покупець не існує');
        return null;
      }
      return buyer;
    } catch (error) {
      throw new BadRequestException('invalid request', error.message);
    }
  }

  async findBuyer(findBuyer: string): Promise<BuyerEntity[]> {
    try {
      const isPhoneNumber = /\d{8}/.test(findBuyer);

      if (isPhoneNumber) {
        const buyersByPhone = await this.buyerRepository
          .createQueryBuilder('buyer')
          .where('buyer.phones::text ILIKE :phone', { phone: `%${findBuyer}%` })
          .getMany();

       if( buyersByPhone.length > 0)  return buyersByPhone;
      }
      const buyersByName = await this.buyerRepository.find({
        where: {
          full_name: ILike(`%${findBuyer}%`),
        },
      });

      if (buyersByName.length > 0) return buyersByName;

      throw new NotFoundException('Покупці не знайдені');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createBuyer(dto: BuyerDto): Promise<BuyerEntity> {
    try {
      const existingBuyers = await this.validateBuyer(dto.phones);

      if (existingBuyers) {
        throw new ConflictException('Покупець з таким номером вже існує');
      }

      const buyer = new BuyerEntity(dto);
      const newBuyer = await this.entityManager.save(buyer);

      if (!newBuyer) {
        throw new BadRequestException('Не вдалось створити покупця');
      }
      return newBuyer;
    } catch (error) {
      throw error;
    }
  }

  async updateBuyer(id: number, dto: BuyerDto): Promise<BuyerEntity> {
    const buyer = await this.findBuyerById(id);
    const existingBuyers = await this.validateBuyer(dto.phones);

    if (existingBuyers && existingBuyers.id !== buyer.id) {
      throw new ConflictException('Покупець з таким номером вже існує');
    }

    Object.assign(buyer, dto);
    const updatedBuyer = await this.entityManager.save(buyer);
    return updatedBuyer;
  }

  async removeBuyer(id: number) {
    try {
      if (!id) {
        throw new BadRequestException(`поле id обов'язкове`);
      }
      const removedBuyer = await this.findBuyerById(id);
      await this.entityManager.remove(removedBuyer);
      return HttpStatus.ACCEPTED;
    } catch (error) {
      throw new BadRequestException(
        'не вдалось видалити користувача',
        error.message,
      );
    }
  }
}
