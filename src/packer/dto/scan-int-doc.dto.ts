import { IsNotEmpty } from "class-validator";

export class ScanIntDocDto  {
    @IsNotEmpty()
    IntDocNumber: string;
    created_at?: Date;
}