import { Injectable, HttpStatus, HttpException, NotFoundException } from '@nestjs/common';
import { ResponseData } from 'src/interfaces/response-data.interface';

  
  @Injectable()
  export class ResponseService {
    successResponse<T>(data: T): ResponseData<T> {
      return {
        success: true,
        total: Array.isArray(data) ? data.length : 1,
        data: data,
      };
    }
  
    errorResponse(message: string, statusCode: HttpStatus) {
      throw new HttpException({ message }, statusCode);
    }
  
    notFoundResponse(message: string) {
      throw new NotFoundException(message);
    }
  }

