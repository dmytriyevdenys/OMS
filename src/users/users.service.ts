import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { SignUpDto } from 'src/auth/dto/signup.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async createUser(dto: SignUpDto): Promise<UserDocument> {
    const user = await this.userModel.create(dto);
    return user;
  }

  async getAllUsers(): Promise<UserDocument[]> {
    const users = await this.userModel.find().exec();

    return users;
  }

  async findUserByEmail(email: string): Promise<UserDocument> {
    const user = this.userModel.findOne({ email }).exec();

    return user;
  }

  async findUserById(id: string | number): Promise<UserDocument> {
    const user= await this.userModel.findById(id)
    return user
  }


}
