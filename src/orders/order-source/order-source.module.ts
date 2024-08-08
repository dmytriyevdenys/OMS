import { Module } from '@nestjs/common';
import { OrderSourceController } from './order-source.controller';
import { OrderSourceService } from './order-source.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SourceEntity } from './entities/source.entity';
import { OrdersApiService } from '../orders-api/orders-api.service';
import { ApiCrmFetchService } from 'src/utils/api-crm-fetch.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ResponseService } from 'src/utils/response.service';
import { MatchService } from 'src/utils/match-model.service';

@Module({
  imports: [TypeOrmModule.forFeature([SourceEntity]), HttpModule],
  controllers: [OrderSourceController],
  providers: [
    OrderSourceService,
    OrdersApiService,
    ApiCrmFetchService,
    ResponseService,
    MatchService
    ],
  exports: [TypeOrmModule],
})
export class OrderSourceModule {}
