import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Req,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { MessageService } from "./message.service";
import { SendMessageDto } from "./dto/send-message.dto";
import { ChatParticipantGuard } from "./guards/chat-participant.guard";
import { AuthGuard } from "@nestjs/passport";

@Controller("messages")
export class MessageController {
  constructor(private service: MessageService) {}

  @UseGuards(AuthGuard("jwt"), ChatParticipantGuard)
  @Get(":conversationId")
  getMessages(@Param("conversationId") id: string) {
    return this.service.getMessages(id);
  }

  @UseGuards(AuthGuard("jwt"), ChatParticipantGuard)
  @Post()
  send(@Body() dto: SendMessageDto, @Req() req) {
    return this.service.send(dto, req.user.sub);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch("read/:conversationId")
  markRead(@Param("conversationId") id: string, @Req() req) {
    console.log('READ MESSAGES:', id);
    return this.service.markAsRead(id, req.user.sub);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("unread/count")
  getUnread(@Req() req) {
    return this.service.countUnread(req.user.sub);
  }
}