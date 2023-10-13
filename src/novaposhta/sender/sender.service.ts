import {
  Injectable,
  NotFoundException,
  BadRequestException,
  BadGatewayException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sender } from '../schemas/sender.schema';
import { Model } from 'mongoose';
import { SenderContactDto, SenderDto } from './dto/sender.dto';
import { SenderContact } from '../schemas/sender-contact.schema';
import { AddressService } from '../noaposhta-address.service';
import { InjectRepository } from '@nestjs/typeorm';
import { SenderEntity } from './entities/sender.entity';
import { EntityManager, Repository } from 'typeorm';
import { error } from 'console';
import { ContractPersonEntity } from './entities/contact-person.entity';

@Injectable()
export class SenderService {
  constructor(
    @InjectModel(Sender.name) private senderModel: Model<Sender>,
    @InjectModel(SenderContact.name)
    private senderContactModel: Model<SenderContact>,
    @InjectRepository(SenderEntity)
    private readonly senderRepository: Repository<SenderEntity>,
    private readonly entityManager: EntityManager,
    private addressService: AddressService,
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
      const senders = await this.senderRepository.find({relations: {Contact: true}});
      if (!senders) throw new BadRequestException('Користувачів не зайндено');
      return senders;
    } catch (error) {
      throw new BadRequestException(error.meassage);
    }
  }

  async findSenderById(id: string): Promise<Sender> {
    const sender = await this.senderModel
      .findById(id)
      .populate('Contact')
      .populate('Address')
      .exec();
    return sender;
  }

  async findSenderByApiKey(apiKey: string): Promise<SenderEntity> {
    try {
      const sender = await this.senderRepository.findOneBy({ apiKey });
      return sender;
    } catch (error) {
      throw error;
    }
  }

  async setSender(dto: SenderDto) {
    const senderValidate = await this.validateSender(dto);

    /*if (!senderValidate) {
      const address = await this.addressService.setAddress(dto);
      const contact = await this.createSenderContact(dto);
      dto.Address = address.id;
      dto.Contact = contact.id;
      const newSender = await this.createSender(dto);
      newSender.Contact = contact;
      contact.Sender = newSender.id;
      await contact.save();
      return newSender;
    }*/
  }
  async findSenderContactByName(name: string) {
    /*const contact = await this.senderContactModel.findOne({ name }).exec();

    return contact;*/
  }

  async findContactById(id: string) {
    const contact = await this.senderContactModel.findById(id);
    return contact;
  }

  async createSenderContact(dto: SenderContactDto) {
    const contact = new ContractPersonEntity(dto);
  return contact;
  }

  async deleteSender(id: { id: string }) {
    const idSender = id.id;
    const sender = await this.senderModel.findByIdAndDelete(idSender);
    return sender;
  }

  async setDefaultSender(id: { id: string }) {
    const idSender = id.id;
    const sender = await this.findSenderById(idSender);

    if (sender) {
      await this.senderModel.updateMany({}, { isDefault: false });
      sender.isDefault = true;
      await sender.save();
      return sender;
    }
    return null;
  }

  async getDefaultSender() {
    const defaultSender = await this.senderModel.findOne({ isDefault: true });
    if (!defaultSender) {
      return null;
    }
    const contact = await this.senderContactModel.findById(
      defaultSender.Contact,
    );
    if (!contact) {
      return null;
    }
    defaultSender.Contact = contact;
    return defaultSender;
  }

  async updateSenderAddress(dto: SenderDto) {
    try {
      // const { id } = dto;
      // const { Address } = dto;
      // const sender = await this.findSenderById(id);
      // sender.Address = Address;
      // await sender.save();
      // return sender;
    } catch (error) {
      throw new BadRequestException('Не Вдалось обновити адресу');
    }
  }
}
