import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class BusinessProfile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  websiteUrl: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  profileImageUrl: string;

  @OneToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: string;
}