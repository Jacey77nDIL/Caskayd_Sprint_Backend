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
import { ChatParticipantGuard } from "./guards/chat-participant.guard";
import { NotificationsModule } from "../notifications/notifications.module";
import { CreatorProfile } from "../creator/creator.entity";
import { CommonModule } from "../helper/common.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatRequest,
      Conversation,
      Message,
      ChatParticipantGuard,
      CreatorProfile,
    ]),
    CommonModule,
    NotificationsModule,
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