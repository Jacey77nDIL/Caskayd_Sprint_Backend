import { IsString } from "class-validator";

export class CreateBusinessDto {
  @IsString()
  websiteUrl!: string;

  @IsString()
  category!: string;
}