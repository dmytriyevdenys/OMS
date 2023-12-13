import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InternetDocumnetEntity } from './entities/internet-document.entity';
import { Brackets, EntityManager, Repository } from 'typeorm';
import { IntDocDto } from './dto/int-doc.dto';
import { ApiIntDocService } from './api-service/api-int-doc.service';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { ResponseService } from 'src/utils/response.service';
import {
  ResponseDataPagination,
} from 'src/interfaces/response-data.interface';
import { FindIntDocDto } from './dto/find-int-doc.dto';

@Injectable()
export class InternetDocumentService {
  constructor(
    @InjectRepository(InternetDocumnetEntity)
    private readonly intDocRepository: Repository<InternetDocumnetEntity>,
    private readonly entityManager: EntityManager,
    private readonly apiService: ApiIntDocService,
    private readonly responseService: ResponseService,
  ) {}

  async createIntDoc(dto: IntDocDto): Promise<InternetDocumnetEntity> {
    try {
      const intDoc = await this.apiService.createIntDoc(dto);

      if (!intDoc) throw this.responseService.errorResponse('Помилка на пошті');

      const newIntDoc = await this.entityManager.save(intDoc);
      return newIntDoc;
    } catch (error) {
      throw this.responseService.errorResponse(error);
    }
  }

  async paginateByPackerId(
    packerId: number,
    options: IPaginationOptions,
  ): Promise<ResponseDataPagination<InternetDocumnetEntity[]>> {
    try {
      const queryBuilder = this.intDocRepository
        .createQueryBuilder('internet_document')
        .leftJoin('internet_document.packer', 'packer')
        .where('packer.id = :packerId', { packerId })
        .select([
          'internet_document.IntDocNumber',
          'internet_document.order_id',
          'internet_document.createdAt',
          'internet_document.status',
        ])
        .orderBy('internet_document.created_at', 'DESC');
      const paginateData = await paginate<InternetDocumnetEntity>(
        queryBuilder,
        options,
      );
      
      return this.responseService.successResponsePaginate(paginateData);
    } catch (error) {
      throw this.responseService.errorResponse(error.message);
    }
  }

  async getAll(
    options: IPaginationOptions,
    query?: FindIntDocDto
  ): Promise<ResponseDataPagination<InternetDocumnetEntity[]>> {
    try {

     const {filter, search} = query || {} ;
     
      const queryBulder =  this.intDocRepository
      .createQueryBuilder('internet_document')
      if (search) queryBulder.andWhere(new Brackets(qb => {
        filter === 'IntDocNumber' &&
        qb.where('internet_document.IntDocNumber LIKE :search', { search: `%${search}%` })
        filter === 'order_id' &&
        qb.where('internet_document.order_id LIKE (:search)', { search: `%${search}%`})
     }));

     queryBulder
     .leftJoinAndSelect('internet_document.packer', 'packer')
     .orderBy('internet_document.createdAt', 'DESC')
      const paginateData = await paginate<InternetDocumnetEntity>(
        queryBulder,
        options,
      );
      if (!paginateData) throw new NotFoundException('Нічого не знайдено');
      return this.responseService.successResponsePaginate(paginateData);
    } catch (error) {
      throw this.responseService.errorResponse(error.message);
    }
  }

  async getById(id: number) {
    try {
      const intDoc = await this.intDocRepository.findOneBy({ id });
      if (!intDoc) throw new NotFoundException('такої ЕН не інсує');
      return this.responseService.successResponse(intDoc);
    } catch (error) {
      throw this.responseService.errorResponse(error);
    }
  }

  async findByIntDocNumber (IntDocNumber: string ) { 
    try { 
      const intDoc = await this.intDocRepository.findOneBy({IntDocNumber});
       if( intDoc) return intDoc
       return null
    }
    catch(error) { 
      throw this.responseService.errorResponse(error.message)
    }
  }

  async updateIntDoc(dto: IntDocDto, id: number) {
    const intDoc = await this.intDocRepository.findOneBy({ id });
    const updatedIntDoc = await this.apiService.updateIntDoc(dto, intDoc.Ref);
    return updatedIntDoc;
  }

  
}
