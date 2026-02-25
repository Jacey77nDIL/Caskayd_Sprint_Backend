import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class BusinessProfile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  websiteUrl: string;

  @Column()
  category: string;

 @OneToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: string;
}