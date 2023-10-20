import { Injectable } from "@nestjs/common";
import { ApiNovaposhtaFetchService } from "src/utils/api-novaposhta-fetch.service";

@Injectable()
export class ApiIntDocService { 
    constructor (
        private readonly apiService: ApiNovaposhtaFetchService
    ) {}
}