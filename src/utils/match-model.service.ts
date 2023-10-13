import { Injectable } from "@nestjs/common";
import { Document, Model } from "mongoose";
import { EntityManager, EntityTarget, ObjectLiteral, Repository, getManager, getRepository } from "typeorm";

@Injectable()
export class MatchService { 
    constructor (
      private readonly entityManager: EntityManager
    ) {}

    async match<T extends Document>(
        model: Model<T>,
        object: any,
      ): Promise<T>  {
        const schemaPaths = model.schema.paths;
        const matchingData: any = {};
    
        for (const path of Object.keys(object)) {
          if (schemaPaths[path]) {
            matchingData[path] = object[path];
          }
        }
    
        return matchingData;
      }
    
      async mapToEntity<T>(entityClass: EntityTarget<T>, data: any): Promise<T[] | undefined> {
        const repository: Repository<T> = this.entityManager.getRepository(entityClass);
        const entity = repository.create(data);
        return entity;
      }
}
