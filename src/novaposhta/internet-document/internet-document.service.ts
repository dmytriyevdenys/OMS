import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InternetDocumnetEntity } from './entities/internet-document.entity';
import { EntityManager, Repository } from 'typeorm';
import { SenderService } from '../sender/sender.service';
import { IntDocDto } from './dto/int-doc.dto';
import { ApiIntDocService } from './api-service/api-int-doc.service';

@Injectable()
export class InternetDocumentService {
  constructor(
    @InjectRepository(InternetDocumnetEntity)
    private readonly intDocRepository: Repository<InternetDocumnetEntity>,
    private readonly entityManager: EntityManager,
    private readonly apiService: ApiIntDocService
  ) {}

  
  async createIntDoc(dto: IntDocDto) {
    try { 
      const intDoc = await this.apiService.createIntDoc(dto); 
      
      if(!intDoc) throw new BadRequestException('Помилка при створенні ттн');

      const newIntDoc = await this.entityManager.save(intDoc);
      return newIntDoc;
    }
    catch(error) { 
      throw new BadRequestException('помилка на пошті', error.message);
    }
  }

  async getAll() { 
    try {
      const intDocuments = await this.intDocRepository.find();

      if (!intDocuments) throw new NotFoundException('Нічого не знайдено')
      return intDocuments;
    }
    catch(error) {
      throw error
    }
  }
}
