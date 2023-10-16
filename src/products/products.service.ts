import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly entityManager: EntityManager,
  ) {}

  async getAllProducts(): Promise<ProductEntity[]> {
    try {
      const products = await this.productRepository.find();
      if (!products)
        throw new BadRequestException('Помилка при завантаженні товарів');
      return products;
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id: number): Promise<ProductEntity> {
    try {
      if (!id) throw new BadRequestException(`Поле id обов'язкове`);
      const product = await this.productRepository.findOneBy({ id });
      if (!product) throw new NotFoundException('Товар з таким id не існує');
      return product;
    } catch (error) {
      throw error;
    }
  }

  async getProductBySkuOrName(query: string): Promise<ProductEntity[]> {
    try {
      const searchWords = query.split(' ').map(word => `(${word})`);
      const searchExpression = searchWords.join('.*');

      const products = await this.entityManager
        .createQueryBuilder(ProductEntity, 'product')
        .where(`LOWER(product.name) ~* :query OR LOWER(product.sku) ~* :query`, { query: searchExpression })
        .orderBy('product.price', 'DESC') 
        .getMany();

      if (!products.length) throw new NotFoundException('Товари не знайдені');

      return products;
    } catch (error) {
      throw error
    }
  }
}
