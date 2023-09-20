import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Address } from './schemas/address.schema';
import { Model } from 'mongoose';
import { SenderDto } from './dto/sender.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name) private addressModel: Model<Address>,
  ) {}

  async setAddress(dto: SenderDto): Promise<Address> {
    try {
        const { Address } = dto
        const address = await this.addressModel.create(Address);

        return address;
   
    } catch (error) {
      throw new BadRequestException('не вдалось додати адресу');
    }
  }
}
