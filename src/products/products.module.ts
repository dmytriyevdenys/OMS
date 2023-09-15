import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { HttpModule } from '@nestjs/axios';
import { ProductsApiService } from './products-api/products-api.service';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductUpdaterService } from './products-api/products-update.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],

  providers: [ProductsService, ProductsApiService, ProductUpdaterService],
  controllers: [ProductsController],
})
export class ProductsModule {}
