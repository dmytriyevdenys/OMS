import { Column, Entity, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity()
export class ProfileEntity  { 
    @PrimaryGeneratedColumn()
    id: number

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

    constructor(profile: Partial<ProfileEntity>){
        Object.assign(this, profile);
    }
}