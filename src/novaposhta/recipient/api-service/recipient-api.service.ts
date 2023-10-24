import { Injectable } from "@nestjs/common";
import { SenderService } from "src/novaposhta/sender/sender.service";
import { ApiNovaposhtaFetchService } from "src/utils/api-novaposhta-fetch.service";
import { RecipientDto } from "../dto/recipient.dto";
import { RecipientInterface } from "../interfaces/recipient.interface";
import { CalledMethod, ModelName } from "src/consts/consts";
import { MatchService } from "src/utils/match-model.service";
import { RecipientEntity } from "../entities/recipient.entity";


@Injectable()
export class RecipientApiService {
    constructor(
        private apiService: ApiNovaposhtaFetchService,
        private senderService: SenderService,
        private matchService: MatchService,
    ) {}

    async createRecipient(dto: RecipientDto): Promise<RecipientEntity> {
        try {
          const  { apiKey }  = await this.senderService.getDefaultSender();
                
          const modelName = ModelName.Counterparty;
          const calledMethod = CalledMethod.save;
          const methodProperties = {
            ...dto,
            CounterpartyType: 'PrivatePerson',
            CounterpartyProperty: 'Recipient'
          };
    
          const response = await this.apiService.sendPostRequest(
            apiKey,
            modelName,
            calledMethod,
            methodProperties,
          );
            
          const data: RecipientInterface = response.data[0];
            const mapData = await this.matchService.mapToEntity(RecipientEntity, data);
            const recipient = {
                ...mapData,
                Phone: dto.Phone,
                ContactRef: data.ContactPerson.data[0].Ref
            }
            const newRecipient = new RecipientEntity(recipient)
            return newRecipient;
            } 
            catch (error) {
                throw error;
            }
      }
    
      async createRecipientOrganization (edrpou : {EDRPOU: string}){
         try {
            const { apiKey } = await this.senderService.getDefaultSender();
          const modelName = ModelName.Counterparty;
          const calledMethod = CalledMethod.save;
          const methodProperties = {
            CounterpartyType : 'Organization',
            EDRPOU: edrpou,
            CounterpartyProperty: 'Recipient'
          }
          const response = await this.apiService.sendPostRequest(
            apiKey,
            modelName,
            calledMethod,
            methodProperties,
          );
    
          const data = response.data;
          return data;
         }
         catch(error) {
    
         }
      }
}