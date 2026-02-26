import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { Exclude } from 'class-transformer';

export enum UserRole {
  BUSINESS = "business",
  CREATOR = "creator",
  ADMIN = "admin",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Exclude()
  @Column()
  password!: string;

  @Column({
    type: "enum",
    enum: UserRole,
  })
  role!: UserRole;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ nullable: true })
 stripeCustomerId: string;
}