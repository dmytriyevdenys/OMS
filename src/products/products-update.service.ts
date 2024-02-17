import { BadRequestException, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProductsApiService } from './products-api/products-api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ProductUpdaterService implements OnModuleInit {
  private readonly logger = new Logger(ProductUpdaterService.name);

  constructor(
    private readonly productsApiService: ProductsApiService,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly entityManager: EntityManager
  ) {}

  onModuleInit() {
    this.updateProducts();
  }

  @Cron('0 0 1 * *')
  async updateProducts() {
    try {
      this.logger.log('Перевірка бази даних та оновлення товарів...');

      const productCount = await this.entityManager.count(ProductEntity);
      if (productCount === 0) {
        this.logger.log('База даних порожня. Оновлення товарів...');
        await this.fetchProductsFromCrm();
      } else { 
        const lastProduct = await this.productRepository.findOneBy({id: 450}); 
        const lastUpdatedDate = lastProduct ? lastProduct.updatedAt : null;

        const comparisonDate = new Date();
        comparisonDate.setMonth(comparisonDate.getMonth() - 1);

        if (!lastUpdatedDate || lastUpdatedDate < comparisonDate) {
          this.logger.log(
            'База даних не оновлювалася протягом останнього місяця. Оновлення товарів...',
          );
          await this.fetchProductsFromCrm();
        } else {
          this.logger.log(
            'База даних оновлювалася протягом останнього місяця. Не потрібно вигружати товари.',
          );
        }
      }

      this.logger.log('Завершено перевірку бази даних та оновлення товарів.');
    } catch (error) {
      this.logger.error(`Помилка оновлення товарів або перевірки бази даних: ${error.message}`);
    }
  }


  async fetchProductsFromCrm () {
    try {
      const products = await this.productsApiService.getAll();
      const newProducts = [];
  
      for (const product of products) {
        const entity = new ProductEntity(product);
        const savedProduct = await this.entityManager.save(entity);
        newProducts.push(savedProduct); 
      }
      
      if (newProducts.length === 0) {
        throw new BadRequestException('Помилка при завантаженні товарів');
      }
      
      return newProducts; 
    } catch (error) { 
      this.logger.log('Помилка при завантаженні товарів в БД');
    }
  }
  
  
}
