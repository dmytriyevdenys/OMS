import { Injectable } from "@nestjs/common";
import { EntityManager, EntityTarget, Repository, } from "typeorm";

@Injectable()
export class MatchService { 
    constructor (
      private readonly entityManager: EntityManager
    ) {}

   
    
      async mapToEntity<T>(entityClass: EntityTarget<T>, data: any): Promise<T[] | undefined> {
        const repository: Repository<T> = this.entityManager.getRepository(entityClass);
        const entity = repository.create(data);
        return entity;
      }
}
