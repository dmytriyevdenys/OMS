import { Injectable, HttpStatus, HttpException, NotFoundException } from '@nestjs/common';
import { ResponseData } from 'src/interfaces/response-data.interface';

  
  @Injectable()
  export class ResponseService {
    successResponse<T>(data: T, status_code: HttpStatus = HttpStatus.OK): ResponseData<T> {
      return {
        success: true,
        status_code,
        data
      };
    }
  
    errorResponse(message: string) {
      throw new HttpException({ message }, HttpStatus.BAD_REQUEST); 
    }
  
    notFoundResponse(message: string) {
      throw new NotFoundException(message);
    }
  }

