import { Module } from '@nestjs/common';
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
import { HttpModule } from '@nestjs/axios';
import { BuyerModule } from './buyer/buyer.module';
import { PackerModule } from './packer/packer.module';
import { PaymentsModule } from './payments/payments.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { CommunicationsModule } from './communications/communications.module';
import { DatabaseModule } from './database/database.module';
import { TasksModule } from './tasks/tasks.module';
import { RoutersModule } from './routers.module';
import { CaslModule } from './auth/ability/casl.module';
const isDev = process.env.NODE_ENV === 'development';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath:'.env.dev', 
    isGlobal: true
  }),
    ScheduleModule.forRoot(),
    ProductsModule,
    AuthModule,
    UsersModule,
    OrdersModule,
    HttpModule,
    BuyerModule,
    PackerModule,
    PaymentsModule,
    DeliveriesModule,
    CommunicationsModule,
    DatabaseModule,
    TasksModule,
    RoutersModule,
    CaslModule
    ],
  controllers: [AppController, ],
  providers: [AppService, 
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }, 
  ],
  exports:[]
})
export class AppModule {}
