import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

enum PaymentLabel {
    CashOnDelivery = 'Наложка',
    Card = 'На карту',
    Advance = 'Аванс',
}
@Entity()
export class PaymentEntity  {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'enum',
        enum: PaymentLabel,
        unique: true, 
    })
    label: PaymentLabel;
   
    @Column()
    value: number

}