import { AbstractEntity } from "src/utils/abstract-entity";
import { Column, Entity } from "typeorm";

@Entity()
export class RoleEntity extends AbstractEntity<RoleEntity> {
    @Column({unique: true})
    name: string;

    @Column()
    color: string;

    @Column()
    alias: string;

}