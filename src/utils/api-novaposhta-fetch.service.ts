import {  BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { API_URL_NOVAPOSHTA } from 'src/consts/consts';

@Injectable()
export class ApiNovaposhtaFetchService {
  constructor(private httpService: HttpService) {}

  async sendPostRequest(
    apiKey: string,
    modelName: string,
    calledMethod: string,
    methodProperties: any,
  ) {
    const apiUrl = API_URL_NOVAPOSHTA;

    const requestData = {
      apiKey: apiKey,
      modelName: modelName,
      calledMethod: calledMethod,
      methodProperties: methodProperties,
    };

    try {
      const response = await this.httpService.axiosRef.post(
        apiUrl,
        requestData,
      );               
      if (!response.data.success) {
        const errorMessages = response.data.errors.join(', ');
        throw new BadRequestException(`Помилка на пошті: ${errorMessages}`);
      }
        return response.data;
    } catch (error) {
      
      throw new BadRequestException(error.message)
    }
  }
}
