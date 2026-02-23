import { CreateChatRequestDto } from "./dto/create-chat-request.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ChatRequest } from "./chat-request.entity";
import { Conversation } from "./conversation.entity";

@Injectable()
export class ChatRequestService {
  constructor(
    @InjectRepository(ChatRequest)
    private repo: Repository<ChatRequest>,

    @InjectRepository(Conversation)
    private convoRepo: Repository<Conversation>,
  ) {}

  create(dto: CreateChatRequestDto, businessId: string) {
    return this.repo.save({
      ...dto,
      business: { id: businessId },
      creator: { id: dto.creatorId },
    });
  }

  findForCreator(userId: string) {
    return this.repo.find({
      where: { creator: { id: userId }, status: "PENDING" },
      relations: ["business"],
    });
  }

  async accept(requestId: string) {
    const request = await this.repo.findOne({
      where: { id: requestId },
      relations: ["creator", "business"],
    });

    request.status = "ACCEPTED";
    await this.repo.save(request);

    return this.convoRepo.save({
      creator: request.creator,
      business: request.business,
      request,
    });
  }

  reject(requestId: string) {
    return this.repo.update(requestId, {
      status: "REJECTED",
    });
  }
}