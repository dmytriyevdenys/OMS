import { Controller, Get } from '@nestjs/common';
import { ResponseData } from 'src/interfaces/response-data.interface';
import { RoleEntity } from './entities/role.entity';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
    constructor (
        private readonly roleService: RoleService
    ) {}

    @Get()
    async getRoles (): Promise<ResponseData<RoleEntity[]>> {
        return await this.roleService.getRoles();
    }
}
