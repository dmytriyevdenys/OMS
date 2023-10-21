import { IsIn, IsString } from 'class-validator';
import { BuyerEntity } from 'src/buyer/entities/buyer.entity';
import { RecipientDto } from 'src/novaposhta/recipient/dto/recipient.dto';
import { SenderEntity } from 'src/novaposhta/sender/entities/sender.entity';

export class IntDocDto {
  sender: SenderEntity;
  buyer: BuyerEntity;
  @IsString()
  city_ref: string;
  @IsString()
  address_ref: string;
  @IsString()
  @IsIn(['Sender', 'Recipient'])
  PayerType: string;
  @IsString()
  @IsIn(['Cash', 'NonCash'])
  PaymentMethod: string;
  @IsString()
  @IsIn(['Cargo', 'Parcel'])
  CargoType: string;
  @IsString()
  Weight: string;
  @IsString()
  @IsIn([
    'DoorsDoors',
    'DoorsWarehouse',
    'WarehouseWarehouse',
    'WarehouseDoors',
  ])
  ServiceType: string;
  @IsString()
  SeatsAmount: string;
  @IsString()
  Description: string;
  @IsString()
  AdditionalInformation: string;
  @IsString()
  Cost: string;
  @IsString()
  InfoRegClientBarcodes: string
}
