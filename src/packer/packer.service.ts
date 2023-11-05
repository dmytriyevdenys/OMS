import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PackerEntity } from './entities/packer.entity';
import { EntityManager, Repository } from 'typeorm';
import { ResponseService } from 'src/utils/response.service';
import { CreatePackerDto } from './dto/create-packer.dto';
import { ResponseData } from 'src/interfaces/response-data.interface';
import { InternetDocumnetEntity } from 'src/novaposhta/internet-document/entities/internet-document.entity';
import { ApiIntDocService } from 'src/novaposhta/internet-document/api-service/api-int-doc.service';
import { OrdersApiService } from 'src/orders/orders-api/orders-api.service';
import { ApiCrmFetchService } from 'src/utils/api-crm-fetch.service';

@Injectable()
export class PackerService {
  constructor(
    @InjectRepository(PackerEntity)
    private readonly packerRepository: Repository<PackerEntity>,
    private readonly entityManager: EntityManager,
    private readonly responseSerivice: ResponseService,
    private readonly apiIntDocServie: ApiIntDocService,
    private readonly apiCrmFethService: ApiCrmFetchService,
  ) {}

  async getAllPacker(): Promise<ResponseData<PackerEntity[]>> {
    try {
      const packers = await this.packerRepository.find();

      if (packers.length === 0)
        throw this.responseSerivice.notFoundResponse('Нічого не знайдено');

      return this.responseSerivice.successResponse(packers);
    } catch (error) {
      throw this.responseSerivice.errorResponse(error.message);
    }
  }

  async createPacker(
    dto: CreatePackerDto,
  ): Promise<ResponseData<PackerEntity>> {
    try {
      const packer = new PackerEntity(dto);
      const newPacker = await this.entityManager.save(packer);

      if (!newPacker)
        throw new BadRequestException(
          'Сталась помилка при створенні пакувальника',
        );

      return this.responseSerivice.successResponse(packer);
    } catch (error) {
      throw this.responseSerivice.errorResponse(error.message);
    }
  }

  async removePacker(id: number) {
    try {
      const removedPacker = await this.findById(id);
      await this.entityManager.remove(removedPacker);
      return 'Пакувальник успішно видалений';
    } catch (error) {
      throw this.responseSerivice.errorResponse(error.message);
    }
  }

  private async findById(id: number): Promise<PackerEntity> {
    try {
      const packer = await this.packerRepository.findOneBy({ id });
      if (!packer)
        throw new NotFoundException('Пакувальник з таким id не інсує');

      return packer;
    } catch (error) {
      throw error;
    }
  }

  async getPackerById(id: number, query?: string) {
    try {
      if (query) {
        const packer = await this.packerRepository.findOne({
          where: { id },
          relations: [query],
        });

        return packer;
      }
      const packer = await this.findById(id);
      return this.responseSerivice.successResponse(packer);
    } catch (error) {
      throw this.responseSerivice.errorResponse(error);
    }
  }

  async addIntDocToPacker(id: number, intDocNumber: string) {
    try {
      const packer = await this.packerRepository.findOne({
        where: { id },
        relations: { internet_document: true },
      });
      const intDoc = new InternetDocumnetEntity({
        IntDocNumber: intDocNumber,
      });
      packer.internet_document.push(intDoc);
      await this.entityManager.save(packer);

      const trackIntDoc =
        await this.apiIntDocServie.getStatusDocument(intDocNumber);

      await this.apiCrmFethService.put(
        `order/${trackIntDoc[0].ClientBarcode}`,
        {
          status_id: 20,
          custom_fields: [
            {
              uuid: 'OR_1003',
              value: `Запакував : ${ 
                packer.name
              } у: число - ${intDoc.createdAt.toLocaleDateString()} час - ${intDoc.createdAt.toLocaleTimeString()}`,
            },
          ],
        },
      );
      return this.responseSerivice.successResponse(intDoc.IntDocNumber);
    } catch (error) {
      throw this.responseSerivice.errorResponse(error.message);
    }
  }
}
