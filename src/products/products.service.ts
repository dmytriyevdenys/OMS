import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ResponseService } from 'src/utils/response.service';
import { ResponseData } from 'src/interfaces/response-data.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly responseService: ResponseService,
  ) {}

  async getProducts(search?: string): Promise<ResponseData<ProductEntity[]>> {
    try {
      if (!search) {
        const products = await this.productRepository.find({ take: 10 });
        return this.responseService.successResponse(products);
      }
      const regexSearch = search
        .split(' ')
        .map((word) => `(?=.*${word})`)
        .join('');
      const products = await this.productRepository
        .createQueryBuilder('product')
        .where(`product.name ~* :regexSearch`, { regexSearch })
        .orWhere('product.sku LIKE :search', {search: `%${search}%`})
        .orderBy(
          `CASE WHEN product.name = :fullSearch THEN 0 ELSE 1 END`,
          'ASC',
        )
        .addOrderBy('product.price', 'ASC')
        .setParameter('fullSearch', search)
        .getMany();

      return this.responseService.successResponse(products);
    } catch (error) {
      throw this.responseService.notFoundResponse(
        'Сталась помилка при пошуку товару',
      );
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

  async getProductBySku (sku: string) {
    try {
        const product = await this.productRepository.findOneBy({sku});
        return product;
    }
    catch (error) {
      throw error;
    }
  }

}
