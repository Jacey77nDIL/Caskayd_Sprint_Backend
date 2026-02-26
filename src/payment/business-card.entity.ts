import { Column,Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class PaymentMethod {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  stripeCustomerId: string;

  @Column()
  stripePaymentMethodId: string;

  @ManyToOne(() => User)
  business: User;

  @CreateDateColumn()
  createdAt: Date;
}