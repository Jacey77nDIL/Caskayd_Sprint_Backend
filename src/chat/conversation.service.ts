import { Conversation } from "./conversation.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private repo: Repository<Conversation>,
  ) {}

  findUserConversations(userId: string) {
    return this.repo.find({
      where: [
        { creator: { id: userId } },
        { business: { id: userId } },
      ],
      relations: ["creator", "business"],
      order: { createdAt: "DESC" },
    });
  }
}