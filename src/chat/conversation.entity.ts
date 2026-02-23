import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  CreateDateColumn,
  JoinColumn
} from "typeorm";
import { User } from "../users/user.entity";
import { ChatRequest } from "./chat-request.entity";

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User)
  creator: User;

  @ManyToOne(() => User)
  business: User;

  @OneToOne(() => ChatRequest)
  @JoinColumn()
  request: ChatRequest;

  @CreateDateColumn()
  createdAt: Date;
}