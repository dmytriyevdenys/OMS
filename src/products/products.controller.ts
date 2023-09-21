import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { IProductForFrontend } from 'src/interfaces/product.interface';
import { Public } from 'src/decorators/public.decorator';
import { ProductsApiService } from './products-api/products-api.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService,
    private productApiService: ProductsApiService
    ) {}
  @Public()
  @Get()
  async getProduct(
    @Query('product') product: string,
  ): Promise<IProductForFrontend[] | string> {
    if (product) {
      return await this.productsService.getProductBySkuOrName(product);
    }
    return await this.productsService.getAllProducts();
  }
  @Public()
  @Get(':id')
  async getProductById(
    @Param('id') id: string,
  ): Promise<IProductForFrontend[] | string> {
   
      return await this.productsService.getProductById(id);
   
  }

}
