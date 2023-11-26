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
import {
  ResponseData,
} from 'src/interfaces/response-data.interface';
import { InternetDocumnetEntity } from 'src/novaposhta/internet-document/entities/internet-document.entity';
import { ApiIntDocService } from 'src/novaposhta/internet-document/api-service/api-int-doc.service';
import { ApiCrmFetchService } from 'src/utils/api-crm-fetch.service';
import { ScanIntDocDto } from 'src/packer/dto/scan-int-doc.dto';
import { IntDocStatus } from 'src/consts/int-doc-status.enum';
import { InternetDocumentService } from 'src/novaposhta/internet-document/internet-document.service';

@Injectable()
export class PackerService {
  constructor(
    @InjectRepository(PackerEntity)
    private readonly packerRepository: Repository<PackerEntity>,
    private readonly entityManager: EntityManager,
    private readonly responseSerivice: ResponseService,
    private readonly apiIntDocServie: ApiIntDocService,
    private readonly apiCrmFethService: ApiCrmFetchService,
    private readonly responseService: ResponseService,
    private readonly intDocService: InternetDocumentService
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

  async findById(id: number): Promise<PackerEntity> {
    try {
      const packer = await this.packerRepository.findOneBy({ id });
      if (!packer)
        throw new NotFoundException('Пакувальник з таким id не інсує');

      return packer;
    } catch (error) {
      throw error;
    }
  }

  async checkPacker(id: number, password: string) {
    try {
      const packer = await this.packerRepository.findOne({
        where: { id },
        relations: { internet_document: true },
      });

      if (packer.password === password) {
        return packer;
      }
      throw new BadRequestException('Пароль не вірний');
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
  async scanIntDoc(
    packerId: number,
    dto: ScanIntDocDto,
  ): Promise<ResponseData<Partial<InternetDocumnetEntity>>> {
    try {
      const packer = await this.packerRepository.findOne({
        where: { id: packerId },
        relations: { internet_document: true },
      });
  
      const existingIntDoc = await this.intDocService.findByIntDocNumber(dto.IntDocNumber);
  
      const intDoc = new InternetDocumnetEntity(dto);
      existingIntDoc ? (intDoc.status = IntDocStatus.Double) : null;
      packer ? (intDoc.packer = packer) : null;
  
      if (dto.IntDocNumber.length >= 14) {
        const trackIntDoc = await this.apiIntDocServie.getStatusDocument(dto.IntDocNumber);
  
        if (trackIntDoc.ClientBarcode) {
          const orderId = trackIntDoc.ClientBarcode;
          intDoc.order_id = orderId;
  
          if (intDoc.status !== IntDocStatus.Double) {
            const changedOrder = await this.apiCrmFethService.put(`order/${orderId}`, {
              status_id: 20,
              custom_fields: [
                {
                  uuid: 'OR_1003',
                  value: `Запакував : ${packer.name} ${new Date().toLocaleString()}`,
                },
              ],
            });
              if (changedOrder) intDoc.status = IntDocStatus.Changed;
              if (!trackIntDoc.ClientBarcode) intDoc.status = IntDocStatus.NotChanged;
          }
        }
      }
        if(!intDoc.status) intDoc.status = IntDocStatus.NotChanged;
      await this.entityManager.save(intDoc);
  
      return this.responseService.successResponse({
        id: intDoc.id,
        IntDocNumber: intDoc.IntDocNumber,
        createdAt: intDoc.createdAt,
        order_id: intDoc.order_id,
        status: intDoc.status,
      });
    } catch (error) {
      throw this.responseService.errorResponse(error.message);
    }
  }
  
}
