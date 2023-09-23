import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { OrdersModule } from './orders/orders.module';
import { NovaposhtaModule } from './novaposhta/novaposhta.module';
import { RecipientModule } from './novaposhta/recipient/recipient.module';
import { HttpModule } from '@nestjs/axios';
import { BuyerModule } from './buyer/buyer.module';
@Module({
  imports: [ConfigModule.forRoot({

  envFilePath: 'development.env',
    isGlobal: true
  }),
    MongooseModule.forRoot(process.env.DB_URI),
    ScheduleModule.forRoot(), 
    ProductsModule,
    AuthModule,
    UsersModule,
    OrdersModule,
    NovaposhtaModule,
    RecipientModule,
    ProductsModule,
    HttpModule,
    BuyerModule
    ],
  controllers: [AppController],
  providers: [AppService, 
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ],
  exports:[]
})
export class AppModule {}
