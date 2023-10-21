import { Injectable } from '@nestjs/common';
import { ApiNovaposhtaFetchService } from 'src/utils/api-novaposhta-fetch.service';
import { IntDocDto } from '../dto/int-doc.dto';
import { ApiIntDoc } from '../interfaces/api-int-doc.interface';
import { RecipientService } from 'src/novaposhta/recipient/recipient.service';
import { RecipientDto } from 'src/novaposhta/recipient/dto/recipient.dto';
import { SenderService } from 'src/novaposhta/sender/sender.service';
import { CalledMethod, ModelName } from 'src/consts/consts';
import { IntDocResponse } from '../interfaces/int-doc-response.interface';

@Injectable()
export class ApiIntDocService {
  constructor(
    private readonly apiService: ApiNovaposhtaFetchService,
    private readonly recipientService: RecipientService,
    private readonly senserService: SenderService
  ) {}
  

  private async mapDtoToRequest(dto: IntDocDto) {
    function formatDate() {
        const date = new Date
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
      }

    const recipient: RecipientDto = new RecipientDto();
    recipient.FirstName = dto.buyer.full_name.split(' ')[0];
    recipient.LastName = dto.buyer.full_name.split(' ')[2];
    recipient.MiddleName = dto.buyer.full_name.split(' ')[1];
    recipient.Email = dto.buyer.email;

    if (dto.buyer.phones && dto.buyer.phones.length > 0) {
      recipient.Phone = dto.buyer.phones[0];
    }
    const newRecipient = await this.recipientService.createRecipient(recipient);
    
    const contactPersonRecipient = newRecipient.ContactPerson.data[0];
   
    const requestObject: Partial<ApiIntDoc> = {
      PayerType: dto.PayerType,
      PaymentMethod: dto.PaymentMethod,
      DateTime: formatDate(),
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
      RecipientsPhone: recipient.Phone,
      ContactRecipient: contactPersonRecipient.Ref, 
    };

    return requestObject;
  }

  async createIntDoc(dto: IntDocDto): Promise<IntDocResponse> {
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
    const data: IntDocResponse = response.data; 
    return data;
  }
}
