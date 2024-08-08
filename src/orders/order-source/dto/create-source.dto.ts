import { UserEntity } from "src/users/entities/user.entity";

export class CreateSourceDto {
    name: string;
    manager: UserEntity
}