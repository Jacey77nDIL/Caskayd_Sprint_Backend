import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  CreateDateColumn
} from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class ChatRequest {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User)
  business: User;

  @ManyToOne(() => User)
  creator: User;

  @Column("text")
  message: string;

  @Column()
  briefUrl: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column("decimal")
  proposedPrice: number;

  @Column({
    type: "enum",
    enum: ["PENDING", "ACCEPTED", "REJECTED"],
    default: "PENDING",
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}