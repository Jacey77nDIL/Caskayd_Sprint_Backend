import { Controller, Get, Req } from "@nestjs/common";
import { ConversationService } from "./conversation.service";
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller("conversations")
export class ConversationController {
  constructor(private service: ConversationService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getUserConversations(@Req() req) {
    return this.service.findUserConversations(req.user.sub);
  }
}