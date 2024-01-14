import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductUpdaterService } from './products-update.service';
import { ProductEntity } from './entities/product.entity';
import { ResponseData } from 'src/interfaces/response-data.interface';

@Controller('product')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private updateService: ProductUpdaterService
  ) {}
  @Get()
  async getProduct(@Query('search') search?: string): Promise<ResponseData<ProductEntity[]>>{
    return await this.productsService.getProducts(search);
  }
  @Get(':id')
  async getProductById(
    @Param('id') id: number,
  ): Promise<ProductEntity>{
    return await this.productsService.getProductById(id);
  }

  @Post('update')
  async setProducts() {
    return await this.updateService.fetchProductsFromCrm();
  }
}
