import { IsString, IsUUID, IsNotEmpty, IsOptional, IsEnum } from "class-validator";
import { MessageType } from "../message.entity";

export class SendMessageDto {
  @IsUUID()
  @IsNotEmpty()
  conversationId: string;

  @IsEnum(MessageType)
  type: MessageType;

  @IsOptional()
  @IsString()
  content?: string; // caption OR text message
}