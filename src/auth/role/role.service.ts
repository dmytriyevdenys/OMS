import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { Repository } from 'typeorm';
import { ResponseService } from 'src/utils/response.service';
import { ResponseData } from 'src/interfaces/response-data.interface';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleEntity: Repository<RoleEntity>,
    private readonly responseService: ResponseService,
  ) {}

  async getRoles(): Promise<ResponseData< RoleEntity[]>> {
    try {
      const roles = await this.roleEntity.find({relations: ['permissions']});
      return this.responseService.successResponse(roles);
    } catch (error) {
      throw this.responseService.errorResponse(error.message);
    }
  }
}
