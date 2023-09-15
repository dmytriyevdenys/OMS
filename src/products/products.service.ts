import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async getAllProducts(): Promise<ProductDocument[]> {
    try {
      const response = await this.productModel.find().exec();
      return response;
    } catch (error) {
      throw new Error('Не вдалося отримати дані з API');
    }
  }

  async getProductById(id: string): Promise<ProductDocument[] | string> {
    const products = await this.productModel.find({ id: id }).exec();

    if (products.length === 0) {
      return 'Товар не знайдено';
    }

    return products;
  }

  async getProductBySkuOrName(
    searchQuery: string,
  ): Promise<ProductDocument[] | string> {
    try {
      const sanitizedQuery = searchQuery.replace(
        /[^a-zA-Z0-9а-яА-Я\s/\\-]/g,
        '',
      );

      const regexQuery = new RegExp(
        sanitizedQuery.split('').join('[\\s/\\-]*'),
        'i',
      );

      const productsByName = await this.productModel.find({
        name: {
          $regex: regexQuery,
        },
      });

      const productsBySku = await this.productModel.find({
        sku: searchQuery,
      });

      const combinedResults = [...productsByName, ...productsBySku];

      return combinedResults;
    } catch (error) {
      throw new Error('Не вдалося отримати дані з API');
    }
  }
}
