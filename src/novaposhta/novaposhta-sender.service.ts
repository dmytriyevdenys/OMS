import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sender } from './schemas/sender.schema';
import { Model } from 'mongoose';
import { SenderDto } from './dto/sender.dto';
import { SenderContact } from './schemas/sender-contact.schema';
import { AddressService } from './noaposhta-address.service';

@Injectable()
export class SenderService {
  constructor(
    @InjectModel(Sender.name) private senderModel: Model<Sender>,
    @InjectModel(SenderContact.name)
    private senderContactModel: Model<SenderContact>,
    private addressService: AddressService,
  ) {}

  async validateSender(dto: SenderDto) {
    const { apiKey } = dto;
    const sender = await this.findSenderByApiKey(apiKey);

    if (sender) {
      throw new NotFoundException('Відправник з таким ключом вже існує!!!');
    }

    return sender;
  }

  async createSender(dto: SenderDto): Promise<Sender> {
    const sender = await this.senderModel.create(dto);

    return sender;
  }

  async getAllSender(): Promise<Sender[]> {
    const sender = await this.senderModel
      .find()
      .populate('Contact')
      .populate('Address')
      .exec();
    return sender;
  }

  async findSenderById(id: string): Promise<Sender> {
    const sender = await this.senderModel
      .findById(id)
      .populate('Contact')
      .populate('Address')
      .exec();
    return sender;
  }

  async findSenderByApiKey(apiKey: string): Promise<Sender> {
    const sender = await this.senderModel.findOne({ apiKey }).exec();

    return sender;
  }

  async setSender(dto: SenderDto): Promise<Sender> {
    const senderValidate = await this.validateSender(dto);

    if (!senderValidate) {
      const address = await this.addressService.setAddress(dto);
      const contact = await this.createSenderContact(dto);
      dto.Address = address.id;
      dto.Contact = contact.id;
      const newSender = await this.createSender(dto);
      newSender.Contact = contact;
      contact.Sender = newSender.id;
      await contact.save();
      return newSender;
    }
  }
  async findSenderContactByName(name: string): Promise<SenderContact> {
    const contact = await this.senderContactModel.findOne({ name }).exec();

    return contact;
  }

  async findContactById(id: string): Promise<SenderContact> {
    const contact = await this.senderContactModel.findById(id);
    return contact;
  }

  async createSenderContact(dto: SenderDto): Promise<SenderContact> {
    const { Contact } = dto;
    const newContact = await this.senderContactModel.create(Contact);

    return newContact;
  }

  async deleteSender(id: { id: string }) {
    const idSender = id.id;
    const sender = await this.senderModel.findByIdAndDelete(idSender);
    return sender;
  }

  async setDefaultSender(id: { id: string }): Promise<Sender | null> {
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

  async getDefaultSender(): Promise<Sender> {
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

  async updateSenderAddress(dto: SenderDto): Promise<Sender> {
    try {
      const { id } = dto;
      const { Address } = dto;
      const sender = await this.findSenderById(id);
      sender.Address = Address;
      await sender.save();
      return sender;
    } catch (error) {
  
      throw new BadRequestException('Не Вдалось обновити адресу');
    }
  }
}
