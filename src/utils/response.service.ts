import {
  Injectable,
  HttpStatus,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { IPaginationMeta, Pagination, paginate } from 'nestjs-typeorm-paginate';
import {
  ResponseData,
  ResponseDataPagination,
} from 'src/interfaces/response-data.interface';

@Injectable()
export class ResponseService {
  public success: boolean;
  public status_code: HttpStatus;

  successResponse<T>(data: T): ResponseData<T> {
    this.success = true;
    this.status_code = HttpStatus.OK;

    return {
      success: this.success,
      status_code: this.status_code,
      data,
    };
  }

  async successResponsePaginate<T>(
    paginationResponse: Pagination<T, IPaginationMeta>,
  ): Promise<ResponseDataPagination<T[]>> {
    this.success = true;
    this.status_code = HttpStatus.OK;

    return {
      success: this.success,
      status_code: this.status_code,
      current_page: paginationResponse.meta.currentPage,
      per_page: paginationResponse.meta.itemsPerPage,
      total_pages: paginationResponse.meta.totalPages,
      total: paginationResponse.meta.totalItems,
      first_page: paginationResponse.links.first,
      next_page: paginationResponse.links.next,
      last_page: paginationResponse.links.last,
      previous_page: paginationResponse.links.previous,
      data: paginationResponse.items,
    };
  }

  errorResponse(message: string) {
    throw new HttpException({ message }, HttpStatus.BAD_REQUEST);
  }

  notFoundResponse(message: string) {
    throw new NotFoundException({message});
  }
}
