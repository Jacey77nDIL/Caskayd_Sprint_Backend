import { SendMessageDto } from "./dto/send-message.dto";
import { Controller } from "@nestjs/common";
import { Post, Body, Req, Get, Param } from "@nestjs/common";
import { MessageService } from "./message.service";

@Controller("messages")
export class MessageController {
  constructor(private service: MessageService) {}

  @Post()
  send(@Body() dto: SendMessageDto, @Req() req) {
    return this.service.send(dto, req.user.id);
  }

  @Get(":conversationId")
  get(@Param("conversationId") id: string) {
    return this.service.getMessages(id);
  }
}