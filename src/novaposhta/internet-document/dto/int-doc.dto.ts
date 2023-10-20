import { IsIn, IsString } from 'class-validator';
import { RecipientDto } from 'src/novaposhta/recipient/dto/recipient.dto';
import { SenderEntity } from 'src/novaposhta/sender/entities/sender.entity';

export class IntDocDto {
  sender: SenderEntity;
  recipient: RecipientDto;
  @IsString()
  @IsIn(['Sender', 'Recipient'])
  PayerType: string;
  @IsString()
  @IsIn(['Cash', 'NonCash'])
  PaymentMethod: string;
  @IsString()
  @IsIn(['Cargo'])
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
  Cost: string;

}
