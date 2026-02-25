import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index
} from "typeorm";
import { User } from "../users/user.entity";
import { OneToOne } from "typeorm";

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
  @Index()
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
  @Index()
  pricePerPost: number;

  // profile image (S3)
  @Column({ nullable: true })
  profileImageUrl: string;

  @OneToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @Column({ nullable: true })
  displayName: string;
  
}