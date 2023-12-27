import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsApiService } from './products-api/products-api.service';
import { ProductUpdaterService } from './products-update.service';
import { ProductEntity } from './entities/product.entity';

@Controller('product')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private productApiService: ProductsApiService,
    private updateService: ProductUpdaterService
  ) {}

  @Get()
  async getProduct(@Query('name') name: string): Promise<ProductEntity[]>{
    if (name) {
      return await this.productsService.getProductBySkuOrName(name);
    }
    return await this.productsService.getAllProducts();
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
