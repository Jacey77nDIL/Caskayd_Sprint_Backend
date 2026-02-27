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
import { UseInterceptors, UploadedFile } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

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
  @UseInterceptors(
  FileInterceptor("file", {
    limits: { fileSize: 50 * 1024 * 1024 },
  }),
  )
  async sendMessage(
    @Body() dto: SendMessageDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    return this.service.sendMessage(dto, file, req.user);
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