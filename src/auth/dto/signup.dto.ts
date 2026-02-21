import { IsEmail, IsEnum, MinLength } from "class-validator";
import { UserRole } from "../../users/user.entity";

export class SignupDto {
  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}