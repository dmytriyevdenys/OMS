import { Injectable } from '@nestjs/common';
import { ApiNovaposhtaFetchService } from 'src/utils/api-novaposhta-fetch.service';
import { IntDocDto } from '../dto/int-doc.dto';
import { ApiIntDoc } from '../interfaces/api-int-doc.interface';
import { RecipientDto } from 'src/novaposhta/recipient/dto/recipient.dto';
import { SenderService } from 'src/novaposhta/sender/sender.service';
import { CalledMethod, ModelName } from 'src/consts/consts';
import { IntDocResponse } from '../interfaces/int-doc-response.interface';
import { RecipientApiService } from 'src/novaposhta/recipient/api-service/recipient-api.service';
import { InternetDocumnetEntity } from '../entities/internet-document.entity';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { ApiKeyService } from 'src/novaposhta/api-service/novaposhta-apikey.service';

@Injectable()
export class ApiIntDocService {
  constructor(
    private readonly apiService: ApiNovaposhtaFetchService,
    private readonly senserService: SenderService,
    private readonly recipientApiService: RecipientApiService,
    private readonly apiKeyService: ApiKeyService
  ) {}
  

 
  async createIntDoc(dto: IntDocDto): Promise<InternetDocumnetEntity> {
    const { apiKey } = await this.senserService.getDefaultSender();
    const modelName = ModelName.InternetDocument;
    const calledMethod = CalledMethod.save;
    const methodProperties = await this.mapDtoToRequest(dto);
    
    const response = await this.apiService.sendPostRequest(
        apiKey,
        modelName,
        calledMethod,
        methodProperties
    )    
    const data: IntDocResponse = response.data[0]; 
    const dataIntDoc =  {
      ...data,
      recipient: methodProperties.recipient
    }
    const intDoc = new InternetDocumnetEntity(dataIntDoc)
    return intDoc;
  }

  async deleteIntDoc (order: OrderEntity, documentRef: string) { 
    const apiKey = await this.apiKeyService.getApiKey(order);
    
    const modelName = ModelName.InternetDocument;
    const calledMethod = CalledMethod.delete;
    const methodProperties =  {
      DocumentRefs: documentRef
    }

    const response = await this.apiService.sendPostRequest(
      apiKey,
      modelName,
      calledMethod,
      methodProperties
    );
    return response.data
  }

  private async mapDtoToRequest(dto: IntDocDto) {
   
    const recipient: RecipientDto = new RecipientDto();
    recipient.FirstName = dto.buyer.full_name.split(' ')[1];
    recipient.LastName = dto.buyer.full_name.split(' ')[0];
    recipient.MiddleName = dto.buyer.full_name.split(' ')[2];
    recipient.Email = dto.buyer.email;

    if (dto.buyer.phones && dto.buyer.phones.length > 0) {
      recipient.Phone = dto.buyer.phones[0];
    }
    const newRecipient = await this.recipientApiService.createRecipient(recipient);
    
   
    const requestObject: Partial<ApiIntDoc> = {
      PayerType: dto.PayerType,
      PaymentMethod: dto.PaymentMethod,
      DateTime: new Date().toLocaleDateString(),
      CargoType: dto.CargoType,
      Weight: dto.Weight,
      ServiceType: dto.ServiceType,
      SeatsAmount: dto.SeatsAmount,
      Description: dto.Description,
      Cost: dto.Cost,
      CitySender: dto.sender.address[0].CityRef,
      Sender: dto.sender.Ref,
      SenderAddress: dto.sender.address[0].Ref,
      ContactSender: dto.sender.Contact.Ref,
      SendersPhone: dto.sender.Contact.Phones,
      CityRecipient: dto.city_ref,
      RecipientAddress: dto.address_ref,
      Recipient: newRecipient.Ref,
      RecipientsPhone: newRecipient.Phone,
      ContactRecipient: newRecipient.ContactRef, 
      AdditionalInformation: dto.AdditionalInformation,
      BackwardDeliveryData: dto.BackwardDeliveryData ? [dto?.BackwardDeliveryData]: null
    };

    return {...requestObject, recipient: newRecipient};
  }

}
