import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { OrdersModule } from './orders/orders.module';
import { NovaposhtaModule } from './novaposhta/novaposhta.module';
import { RecipientModule } from './novaposhta/recipient/recipient.module';
import { HttpModule } from '@nestjs/axios';
import { BuyerModule } from './buyer/buyer.module';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { SenderModule } from './novaposhta/sender/sender.module';
import { AddressModule } from './novaposhta/address/address.module';
import { InternetDocumentModule } from './novaposhta/internet-document/internet-document.module';
import { PackerModule } from './packer/packer.module';
const isDev = process.env.NODE_ENV === 'development';

@Module({
  imports: [ConfigModule.forRoot({

    envFilePath: isDev && '.env.prod',
    isGlobal: true
  }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({ 
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_NAME'),
        entities: [],
        synchronize: true,
        autoLoadEntities: true
      }),
      inject: [ConfigService],
    }),
    ProductsModule,
    AuthModule,
    UsersModule,
    OrdersModule,
    NovaposhtaModule,
    RecipientModule,
    ProductsModule,
    HttpModule,
    BuyerModule,
    SenderModule,
    AddressModule,
    InternetDocumentModule,
    PackerModule
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
