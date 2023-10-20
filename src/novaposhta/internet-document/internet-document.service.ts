import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InternetDocumnetEntity } from './entities/internet-document.entity';
import { EntityManager, Repository } from 'typeorm';
import { SenderService } from '../sender/sender.service';

@Injectable()
export class InternetDocumentService {
  constructor(
    @InjectRepository(InternetDocumnetEntity)
    private readonly intDocRepository: Repository<InternetDocumnetEntity>,
    private readonly entityManager: EntityManager,
    private readonly senderService: SenderService
  ) {}

  
  async createIntDoc(dto) {
    
  }
}
