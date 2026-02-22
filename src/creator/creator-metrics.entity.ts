import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { CreatorProfile } from "./creator.entity";

@Entity()
export class CreatorMetrics {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  platform: string; // instagram | tiktok

  @Column({ type: "int", default: 0 })
  followers: number;

  @Column({ type: "int", default: 0 })
  avgLikes: number;

  @Column({ type: "int", default: 0 })
  avgComments: number;

  @Column({ type: "float", default: 0 })
  engagementRate: number;

  @ManyToOne(() => CreatorProfile)
  creator: CreatorProfile;
}