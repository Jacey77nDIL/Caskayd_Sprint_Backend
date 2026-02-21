import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class CreatorProfile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  bio: string;

  @Column()
  niche: string;

  @Column({ nullable: true })
  tiktok: string;

  @Column({ nullable: true })
  instagram: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}