import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProductsApiService } from './products-api.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';

@Injectable()
export class ProductUpdaterService implements OnModuleInit {
  private readonly logger = new Logger(ProductUpdaterService.name);

  constructor(
    private readonly productsApiService: ProductsApiService,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  onModuleInit() {
    this.updateProducts();
  }

  @Cron('0 0 1 * *')
  async updateProducts() { 
    try {
      this.logger.log('Перевірка бази даних та вигрузка товарів...');

      const productCount = await this.productModel.countDocuments().exec();
      if (productCount === 0) {
        this.logger.log('База даних порожня. Вигрузка товарів...');
        await this.fetchProducts();
      } else {
        const lastProduct = await this.productModel
          .findOne()
          .sort('-updatedAt')
          .exec();
        const lastUpdatedDate = lastProduct ? lastProduct.updatedAt : null;

        const comparisonDate = new Date();
        comparisonDate.setMonth(comparisonDate.getMonth() - 1);

        if (!lastUpdatedDate || lastUpdatedDate < comparisonDate) {
          this.logger.log(
            'База даних не оновлювалася за останній місяць. Вигрузка товарів...',
          );
          await this.fetchProducts();
        } else {
          this.logger.log(
            'База даних оновлювалася за останній місяць. Не потрібно вигружати товари.',
          );
        }
      }

      this.logger.log('Завершено перевірку бази даних та вигрузку товарів.');
    } catch (error) {
      this.logger.error(
        `Помилка вигрузки товарів або перевірки бази даних: ${error.message}`,
      );
    }
  }

  private async fetchProducts() {
    try {
      this.logger.log('Запуск вигрузки товарів...');
      const products = await this.productsApiService.getAll();
      this.logger.log(`Завершено. Завантажено ${products.length} товарів.`);

      const createdProducts = await this.productModel.create(products);

      return createdProducts;
    } catch (error) {
      this.logger.error(`Помилка вигрузки товарів: ${error.message}`);
    }
  }
}
