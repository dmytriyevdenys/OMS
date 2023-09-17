import { Injectable } from "@nestjs/common";
import { Document, Model } from "mongoose";

@Injectable()
export class MatchModelService { 
    constructor () {}

    async match<T extends Document>(
        model: Model<T>,
        object: any,
      ): Promise<T> {
        const schemaPaths = model.schema.paths;
        const matchingData: any = {};
    
        for (const path of Object.keys(object)) {
          if (schemaPaths[path]) {
            matchingData[path] = object[path];
          }
        }
    
        return matchingData;
      }
}
