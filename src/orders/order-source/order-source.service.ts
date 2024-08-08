import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SourceEntity } from './entities/source.entity';
import { EntityManager, Repository } from 'typeorm';
import { OrdersApiService } from '../orders-api/orders-api.service';
import { ResponseService } from 'src/utils/response.service';
import { MatchService } from '../../utils/match-model.service';
import { ResponseData } from 'src/interfaces/response-data.interface';

@Injectable()
export class OrderSourceService {
  constructor(
    @InjectRepository(SourceEntity)
    private readonly sourceRepository: Repository<SourceEntity>,
    private readonly orderApiService: OrdersApiService,
    private readonly responseService: ResponseService,
    private readonly matchService: MatchService,
    private readonly entityManager: EntityManager,
  ) {}

  private async getCrmSources(): Promise<SourceEntity[]> {
    try {
      const sources = await this.orderApiService.getSource();
      if (sources) {
        const test = this.matchService.mapToEntity(SourceEntity, sources);
        return test;
      }
    } catch (error) {
      throw this.responseService.errorResponse(error.message);
    }
  }

  private async createSource(source: SourceEntity) {
    try {
      const newSource = new SourceEntity(source);
      await this.entityManager.save(newSource);
      return newSource;
    } catch (error) {
      throw this.responseService.errorResponse(error.message);
    }
  }

  async syncSourceFromCrm(): Promise<SourceEntity[]> {
    try {
      const sources = await this.getCrmSources();
      const syncSources = await Promise.all(
        sources.map(async (source) => {
          const existingSource = await this.sourceRepository.findOneBy({
            id: source.id,
          });
          if (!existingSource) return await this.createSource(source);
          return null;
        }),
      );
      return syncSources.filter((elem) => elem !== null);
    } catch (error) {
      throw this.responseService.errorResponse(error.message);
    }
  }

  async getAllSources(): Promise<ResponseData<SourceEntity[]>> {
    try {
      const sources = await this.sourceRepository.find();
      return this.responseService.successResponse(sources);
    } catch (error) {
      throw this.responseService.errorResponse(error.message);
    }
  }
}
