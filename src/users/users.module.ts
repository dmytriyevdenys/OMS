import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';


@Module({
  imports: [

  MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports:[MongooseModule,UsersService]
})
export class UsersModule {}
