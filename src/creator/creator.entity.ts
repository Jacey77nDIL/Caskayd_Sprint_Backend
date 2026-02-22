import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class CreatorProfile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  bio: string;

  // array for recommendations
  @Column({ type: "json", nullable: true })
  niches: string[];

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  tiktok: string;

  @Column({ nullable: true })
  instagram: string;

  // follower counts
  @Column({ type: "int", default: 0 })
  tiktokFollowers: number;

  @Column({ type: "int", default: 0 })
  instagramFollowers: number;

  // engagement rates
  @Column({ type: "float", default: 0 })
  tiktokEngagementRate: number;

  @Column({ type: "float", default: 0 })
  instagramEngagementRate: number;

  // pricing for marketplace
  @Column({ type: "float", nullable: true })
  pricePerPost: number;

  // profile image (S3)
  @Column({ nullable: true })
  profileImageUrl: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  
}