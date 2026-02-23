import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User)
  recipient: User;

  @Column()
  type: string;
  // CHAT_REQUEST | REQUEST_ACCEPTED | NEW_MESSAGE

  @Column("text")
  message: string;

  @Column({ nullable: true })
  relatedId: string; // requestId or conversationId

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}