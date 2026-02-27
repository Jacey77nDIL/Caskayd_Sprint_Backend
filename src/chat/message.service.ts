import { SendMessageDto } from "./dto/send-message.dto";
import { Message } from "./message.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { NotificationsService } from "../notifications/notifications.service";
import { Conversation } from "./conversation.entity";
import { Not } from "typeorm";
import { R2Service } from "./r2.service";

@Injectable()
export class MessageService {
  constructor(
  @InjectRepository(Message)
  private repo: Repository<Message>,

  @InjectRepository(Conversation)
  private convoRepo: Repository<Conversation>,

  private notifications: NotificationsService,

  private r2Service: R2Service,
) {}

async sendMessage(
  dto: SendMessageDto,
  file: Express.Multer.File,
  user: any,
) {
  let fileData = {};

  if (file) {
    fileData = await this.r2Service.uploadFile(file);
  }

  const message = await this.repo.save({
    conversation: { id: dto.conversationId },
    sender: { id: user.sub },
    type: dto.type,
    content: dto.content,
    ...fileData,
  });

  const conversation = await this.convoRepo.findOne({
    where: { id: dto.conversationId },
    relations: ["creator", "business"],
  });

  const recipientId =
    conversation.creator.id === user.sub
      ? conversation.business.id
      : conversation.creator.id;

  await this.notifications.create(
    recipientId,
    "NEW_MESSAGE",
    "You have a new message",
    dto.conversationId,
  );

  return message;
}

  getMessages(conversationId: string) {
    return this.repo.find({
      where: { conversation: { id: conversationId } },
      relations: ["sender"],
      order: { createdAt: "ASC" },
    });
  }

   async markAsRead(conversationId: string, userId: string) {
    await this.repo.update(
        {
        conversation: { id: conversationId },
        sender: { id: Not(userId) },
        isRead: false,
        },
        { isRead: true },
    );
    }

    countUnread(userId: string) {
  return this.repo
    .createQueryBuilder("message")
    .leftJoin("message.conversation", "conversation")
    .where("message.isRead = false")
    .andWhere("message.senderId != :userId", { userId })
    .andWhere(
      "(conversation.creatorId = :userId OR conversation.businessId = :userId)",
      { userId },
    )
    .getCount();
    }
}