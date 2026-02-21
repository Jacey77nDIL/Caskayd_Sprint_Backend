import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { CreatorProfile } from "./creator.entity";

@Entity()
export class CreatorMetrics {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  followers: number;

  @Column("float")
  engagementRate: number;

  @OneToOne(() => CreatorProfile)
  @JoinColumn()
  creator: CreatorProfile;
}