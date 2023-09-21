import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { apiUrlCrm } from 'src/consts/consts';

@Injectable()
export class ApiCrmFetchService {
  constructor(private readonly httpService: HttpService) {}

  async get(endpoint: string, query: Record<string, any> = {}) {
    const apiUrl = `${apiUrlCrm}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: process.env.API_KEY_CRM,
    };
    try {
      const response = await this.httpService.axiosRef.get(apiUrl, {
        headers,
        params: query
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async post(endpoint: string, data: any) {
    const apiUrl = `${apiUrlCrm}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: process.env.API_KEY_CRM,
    };
    try {
      const response = await this.httpService.axiosRef.post(apiUrl, data, {
        headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async put(endpoint: string, data: any) {
    const apiUrl = `${apiUrlCrm}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: process.env.API_KEY_CRM,
    };
    try {
      const response = await this.httpService.axiosRef.put(apiUrl, data, {
        headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
