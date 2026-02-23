import { Controller, Post, Body, Get, Param, Req } from "@nestjs/common";
import { MessageService } from "./message.service";
import { SendMessageDto } from "./dto/send-message.dto";

@Controller("messages")
export class MessageController {
  constructor(private service: MessageService) {}

  @Post()
  send(@Body() dto: SendMessageDto, @Req() req) {
    return this.service.send(dto, req.user.id);
  }

  @Get(":conversationId")
  getMessages(@Param("conversationId") id: string) {
    return this.service.getMessages(id);
  }
}