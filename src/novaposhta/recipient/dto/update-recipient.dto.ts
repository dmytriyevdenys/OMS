import { PartialType } from "@nestjs/mapped-types";
import { RecipientDto } from "./recipient.dto";

export class UpdateRecipientDto extends PartialType(RecipientDto) {}