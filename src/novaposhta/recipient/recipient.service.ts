import { Injectable } from '@nestjs/common';
import { ApiNovaposhtaFetchService } from 'src/utils/api-novaposhta-fetch.service';
import { MatchService } from 'src/utils/match-model.service';
import { RecipientDto } from './dto/recipient.dto';
import { CalledMethod, ModelName } from 'src/consts/consts';
import { SenderService } from '../sender/sender.service';
import { ApiKeyService } from '../api-service/novaposhta-apikey.service';
import { RecipientInterface } from './interfaces/recipient.interface';

@Injectable()
export class RecipientService {
  constructor(
  
  ) {}

 
}
