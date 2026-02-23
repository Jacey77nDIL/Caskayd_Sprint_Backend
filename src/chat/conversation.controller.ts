import { Controller, Get, Req } from "@nestjs/common";
import { ConversationService } from "./conversation.service";

@Controller("conversations")
export class ConversationController {
  constructor(private service: ConversationService) {}

  @Get()
  getUserConversations(@Req() req) {
    return this.service.findUserConversations(req.user.id);
  }
}