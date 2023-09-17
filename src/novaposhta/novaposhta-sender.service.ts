import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sender } from './schemas/sender.schema';
import { Model } from 'mongoose';
import { SenderDto } from './dto/sender.dto';
import { SenderContact } from './schemas/sender-contact.schema';

@Injectable()
export class SenderService {
  constructor(
    @InjectModel(Sender.name) private senderModel: Model<Sender>,
    @InjectModel(SenderContact.name)
    private senderContactModel: Model<SenderContact>,
  ) {}

  async validateSender(dto: SenderDto) {
    const { apiKey } = dto;
    const sender = await this.findSenderByApiKey(apiKey);

    if (sender) {
      throw new BadRequestException('Відправник з таким ключом вже існує!!!');
    }
    return sender;
  }

  async createSender(dto: SenderDto): Promise<Sender> {
    try {
      const sender = await this.senderModel.create(dto);
      return sender;
    } catch (error) {
      throw new InternalServerErrorException(
        'Помилка при створенні відправника.',
      );
    }
  }

  async getAllSender(): Promise<Sender[]> {
    try {
      const senders = await this.senderModel.find().exec();
      return senders;
    } catch (error) {
      throw new InternalServerErrorException(
        'Помилка при отриманні списку відправників.',
      );
    }
  }

  async findSenderById(id: string): Promise<Sender> {
    try {
      const sender = await this.senderModel.findById(id);
      if (!sender) {
        throw new NotFoundException('Відправник не знайдений.');
      }
      const idContact = sender.Contact;
      const contact = await this.senderContactModel.findById(idContact);
      sender.Contact = contact;
      return sender;
    } catch (error) {
      throw new InternalServerErrorException(
        'Помилка при пошуку відправника за ID.',
      );
    }
  }

  async findSenderByApiKey(apiKey: string): Promise<Sender> {
    try {
      const sender = await this.senderModel.findOne({ apiKey }).exec();
      if (!sender) {
        throw new NotFoundException('Відправник не знайдений.');
      }
      return sender;
    } catch (error) {
      throw new InternalServerErrorException(
        'Помилка при пошуку відправника за API ключем.',
      );
    }
  }

  async setSender(dto: SenderDto): Promise<Sender | undefined> {
    const senderValidate = await this.validateSender(dto);

    if (senderValidate) {
      try {
        const contact = await this.createSenderContact(dto);
        const { id } = contact;
        dto.Contact = id;
        const newSender = await this.createSender(dto);
        newSender.Contact = contact;
        return newSender;
      } catch (error) {
        throw new InternalServerErrorException(
          'Помилка при створенні відправника та/або контакту.',
        );
      }
    }

    return undefined;
  }

  async findSenderContactByName(name: string): Promise<SenderContact> {
    try {
      const contact = await this.senderContactModel.findOne({ name }).exec();
      if (!contact) {
        throw new NotFoundException('Контакт не знайдений.');
      }
      return contact;
    } catch (error) {
      throw new InternalServerErrorException(
        `Помилка при пошуку контакту за ім'ям.`,
      );
    }
  }

  async findContactById(id: string): Promise<SenderContact> {
    try {
      const contact = await this.senderContactModel.findById(id);
      if (!contact) {
        throw new NotFoundException('Контакт не знайдений.');
      }
      return contact;
    } catch (error) {
      throw new InternalServerErrorException(
        'Помилка при пошуку контакту за ID.',
      );
    }
  }

  async createSenderContact(dto: SenderDto): Promise<SenderContact> {
    try {
      const { Contact } = dto;
      const newContact = await this.senderContactModel.create(Contact);
      return newContact;
    } catch (error) {
      throw new InternalServerErrorException('Помилка при створенні контакту.');
    }
  }

  async deleteSender(id: { id: string }): Promise<Sender> {
    const idSender = id.id;
    try {
      const sender = await this.senderModel.findByIdAndDelete(idSender);
      if (!sender) {
        throw new NotFoundException('Відправник не знайдений.');
      }
      return sender;
    } catch (error) {
      throw new InternalServerErrorException(
        'Помилка при видаленні відправника.',
      );
    }
  }

  async setDefaultSender(id: { id: string }): Promise<Sender> {
    const idSender = id.id;
    const sender = await this.findSenderById(idSender);

    if (sender) {
      await this.senderModel.updateMany({}, { isDefault: false });
      sender.isDefault = true;
      await sender.save();

      return sender;
    }
  }

  async getDefaultSender() {
    const defaultSender = await this.senderModel.findOne({ isDefault: true });
    const contact = await this.senderContactModel.findById(defaultSender.Contact);
    defaultSender.Contact = contact;
    
    return defaultSender;
  }
}
