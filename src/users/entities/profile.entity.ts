import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { AbstractEntity } from "src/utils/abstract-entity";

@Entity()
export class ProfileEntity extends AbstractEntity<ProfileEntity>  { 
   
    @Column({ nullable: true })
    phone: string;
   
    @Column({ nullable: true })
    manager_id:number;

    @Column({ nullable: true })
    manager_name: string;

    @Column({ nullable: true })
    source_id: number;

    @Column({ nullable: true })
    source_name: string

    @OneToOne(() => UserEntity, user => user.profile)
    user: UserEntity

}