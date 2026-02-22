import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { CreatorProfile } from "./creator.entity";

@Entity()
export class CreatorFinance {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // marketplace pricing
  @Column({ type: "float", nullable: true })
  pricePerPost: number;

  @Column({ type: "float", nullable: true })
  pricePerStory: number;

  @Column({ type: "float", nullable: true })
  pricePerVideo: number;

  // optional base rate
  @Column({ type: "float", nullable: true })
  rate: number;

  // payout details
  @Column({ nullable: true })
  bankName: string;

  @Column({ nullable: true })
  accountNumber: string;

  @OneToOne(() => CreatorProfile)
  @JoinColumn()
  creator: CreatorProfile;
}