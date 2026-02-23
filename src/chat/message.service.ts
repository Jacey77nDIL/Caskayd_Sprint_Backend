import { SendMessageDto } from "./dto/send-message.dto";
import { Message } from "./message.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private repo: Repository<Message>,
  ) {}

  send(dto: SendMessageDto, senderId: string) {
    return this.repo.save({
      conversation: { id: dto.conversationId },
      sender: { id: senderId },
      content: dto.content,
    });
  }

  getMessages(conversationId: string) {
    return this.repo.find({
      where: { conversation: { id: conversationId } },
      relations: ["sender"],
      order: { createdAt: "ASC" },
    });
  }
}