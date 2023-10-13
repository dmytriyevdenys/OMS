import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiCrmFetchService } from 'src/utils/api-crm-fetch.service';
import { MatchService } from 'src/utils/match-model.service';
import { ProductEntity } from '../entities/product.entity';


@Injectable()
export class ProductsApiService {
  constructor(
    private apiService: ApiCrmFetchService,
    private readonly matchService: MatchService,
  ) {}

  async getAll(): Promise<ProductEntity[]> {
    try {
      const endpoint = 'products';
      const products = [];
      let responseData;
      let currentPage = 1;
      do {
        responseData = await this.apiService.get(endpoint, {
          limit: 50,
          page: currentPage,
        });
        for (const product of responseData.data) {
          const mappedProduct = await this.matchService.mapToEntity(
            ProductEntity,
            product,
          );
          if (!mappedProduct) {
            throw new BadRequestException('Помилка, ну як без неї');
          }
          products.push(mappedProduct);
        }
        currentPage++;
      } while (currentPage <= responseData.last_page);
      return products;
    } catch (error) {
      throw error;
    }
  }
}
