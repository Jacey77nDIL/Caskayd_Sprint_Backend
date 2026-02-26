import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User)
  business: User;

  @ManyToOne(() => User)
  creator: User;

  @Column("decimal")
  amount: number;

  @Column("decimal")
  adminFee: number;

  @Column("decimal")
  creatorAmount: number;

  @Column()
  reference: string;

  @Column({ default: "pending" })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column("decimal", { precision: 10, scale: 2 })
 totalPaid: number;
}