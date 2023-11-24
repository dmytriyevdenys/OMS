import { InternetDocumnetEntity } from "src/novaposhta/internet-document/entities/internet-document.entity";
import { AbstractEntity } from "src/utils/abstract-entity";
import { Column, Entity, OneToMany,  } from "typeorm";

@Entity()
export class PackerEntity extends AbstractEntity<PackerEntity> { 
    @Column()
    name: string;

    @Column()
    password: string

    @OneToMany(() => InternetDocumnetEntity, (intDoc) => intDoc.packer, {cascade: true, nullable: true})
    internet_document: InternetDocumnetEntity[];
}