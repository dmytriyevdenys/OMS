import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { HttpModule,  } from '@nestjs/axios';
import { ProductsApiService } from './products-api/products-api.service';
import { ProductUpdaterService } from './products-update.service';
import { ApiCrmFetchService } from 'src/utils/api-crm-fetch.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { MatchService } from 'src/utils/match-model.service';
import { ResponseService } from 'src/utils/response.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([ProductEntity])
  ],
  providers: [
    ProductsService,
    ProductsApiService,
    ProductUpdaterService,
    ApiCrmFetchService,
    MatchService,
    ResponseService
  ],
  controllers: [ProductsController],
})
export class ProductsModule {}
