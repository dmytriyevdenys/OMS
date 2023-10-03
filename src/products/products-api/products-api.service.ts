import {  Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  IProduct,
  IProductApiResponse,
  IProductForFrontend,
} from 'src/interfaces/product.interface';
import { apiUrlCrm } from 'src/consts/consts';
import { ApiCrmFetchService } from 'src/utils/api-crm-fetch.service';


@Injectable()
export class ProductsApiService {
  constructor(
    private readonly httpService: HttpService,
    private apiService: ApiCrmFetchService,
  ) {}

  async getAll(): Promise<IProductForFrontend[]> {
    const apiUrl = `${apiUrlCrm}product`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: process.env.API_KEY_CRM,
    };

    let products: IProduct[] = []; 
    let currentPage = 1;
    let responseData: IProductApiResponse;

    do {
      const response = await this.httpService.axiosRef.get(apiUrl, {
        params: {
          page: currentPage,
        },
        headers,
      });

      responseData = response.data;
      products = [...products, ...responseData.data];
      currentPage++;
    } while (currentPage <= responseData.last_page);

    const productsForFrontend: IProductForFrontend[] = products.map(
      (product) => ({
        id: product.id,
        name: product.name,
        quantity: product.quantity,
        weight: product.weight,
        sku: product.sku,
        price: product.price,
      }),
    );

    return productsForFrontend;
  }

 
}
