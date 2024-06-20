export interface ApiIntDoc { 

 SenderWarehouseIndex?: string;
  RecipientWarehouseIndex?: string;
  PayerType: string;
  PaymentMethod: string;
  DateTime: string;
  CargoType: string;
  VolumeGeneral: number;
  Weight: string;
  ServiceType: string;
  SeatsAmount: string;
  Description: string;
  Cost: string;
  CitySender: string;
  Sender: string;
  SenderAddress: string;
  ContactSender: string;
  SendersPhone: string;
  CityRecipient: string;
  Recipient: string;
  RecipientAddress: string;
  ContactRecipient: string;
  RecipientsPhone: string;
  AdditionalInformation: string;
  BackwardDeliveryData: [
    {
      PayerType: string;
      CargoType: string;
      RedeliveryString: string;
    }
  ]
}