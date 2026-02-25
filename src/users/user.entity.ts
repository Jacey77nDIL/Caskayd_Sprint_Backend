import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

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
}