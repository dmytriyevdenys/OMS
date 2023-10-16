import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { SenderDto } from './dto/sender.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SenderEntity } from './entities/sender.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class SenderService {
  constructor(
    @InjectRepository(SenderEntity)
    private readonly senderRepository: Repository<SenderEntity>,
    private readonly entityManager: EntityManager,
  ) {}

  async validateSender(dto: SenderDto) {
    const { apiKey } = dto;
    const sender = await this.findSenderByApiKey(apiKey);

    if (sender) {
      throw new NotFoundException('Відправник з таким ключом вже існує!!!');
    }
    return !!sender;
  }

  async createSender(dto: SenderDto) {
    try {
      const validateApiKey = await this.validateSender(dto);
      if (!validateApiKey) {
        const sender = new SenderEntity(dto);
        const newSender = await this.entityManager.save(sender);
        if (!newSender)
          throw new BadRequestException('Помилка при створенні користувача');
        return newSender;
      }
    } catch (error) {
      throw error;
    }
  }

  async getAllSender() {
    try {
      const senders = await this.senderRepository.find({
        relations: { Contact: true },
      });
      if (!senders) throw new BadRequestException('Користувачів не зайндено');
      return senders;
    } catch (error) {
      throw new BadRequestException(error.meassage);
    }
  }

  async findSenderById(id: number) {
    try {
      const sender = await this.senderRepository.findOne({ 
        where: {id},
        relations: {Contact: true}
       });
      if (!sender)
        throw new BadRequestException('Користувач з таким id не існує');
      return sender;
    } catch (error) {
      throw new BadRequestException('Помилка', error.message);
    }
  }

  async findSenderByApiKey(apiKey: string): Promise<SenderEntity> {
    try {
      const sender = await this.senderRepository.findOneBy({ apiKey });
      return sender;
    } catch (error) {
      throw error;
    }
  }

  async findSenderContactByName(nickName: string): Promise<SenderEntity> {
    try {
      const sender = this.senderRepository.findOneBy({ nickName });
      if (!sender) throw new BadRequestException('Користувача не знайдено');

      return sender;
    } catch (error) {
      throw error;
    }
  }

  async deleteSender(id: number) {
    try {
      const deletedSender = await this.findSenderById(id);
      await this.entityManager.remove(deletedSender);
      return {
        success: true,
        status: HttpStatus.ACCEPTED,
      };
    } catch (error) {
      throw new BadRequestException(
        'Не вдалось видалити відправника',
        error.message,
      );
    }
  }

  async setDefaultSender(id: number) {
    try {
     await this.resetDefaultSender();

      const sender = await this.findSenderById(id);
      sender.isDefault = true;
      await this.entityManager.save(sender);
      return sender;
    
      
    } catch (error) {
      throw error;
    }
  }

  async getDefaultSender() {
    try {
      const defaultSender = await this.senderRepository.findOneBy({
        isDefault: true,
      });
      if (!defaultSender)
        throw new BadRequestException(
          'Відправника за замовчуванню не знайдений',
        );
      return defaultSender;
    } catch (error) {
      throw error;
    }
  }

  private async resetDefaultSender() {
    try {
      const defaultSender = await this.senderRepository.findOne({ where: { isDefault: true } });
      if (defaultSender) {
        defaultSender.isDefault = false;
        await this.entityManager.save(defaultSender);
      }
    } catch (error) {
      throw error;
    }
  }
}
