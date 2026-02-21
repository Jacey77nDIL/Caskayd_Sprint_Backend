import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { CreatorProfile } from "./creator.entity";

@Entity()
export class CreatorFinance {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  rate: number;

  @Column()
  bankName: string;

  @Column()
  accountNumber: string;

  @OneToOne(() => CreatorProfile)
  @JoinColumn()
  creator: CreatorProfile;
}