import { ChatRequest } from "./chat-request.entity";
import { Conversation } from "./conversation.entity";
import { Message } from "./message.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatRequestController } from "./chat-request.controller";
import { ConversationService } from "./conversation.service";
import { ChatRequestService } from "./chat-request.service";
import { Module } from "@nestjs/common";
import { MessageService } from "./message.service";
import { MessageController } from "./message.controller";
import { ConversationController } from "./conversation.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatRequest,
      Conversation,
      Message,
    ]),
  ],
  controllers: [
    ChatRequestController,
    ConversationController,
    MessageController,
  ],
  providers: [
    ChatRequestService,
    ConversationService,
    MessageService,
  ],
})
export class ChatModule {}