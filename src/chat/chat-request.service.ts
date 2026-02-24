import { CreateChatRequestDto } from "./dto/create-chat-request.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ChatRequest } from "./chat-request.entity";
import { Conversation } from "./conversation.entity";
import { NotificationsService } from "../notifications/notifications.service";
import { CreatorProfile } from "../creator/creator.entity";

@Injectable()
export class ChatRequestService {
  constructor(
    @InjectRepository(ChatRequest)
    private repo: Repository<ChatRequest>,
    private notifications: NotificationsService,

    @InjectRepository(Conversation)
    private convoRepo: Repository<Conversation>,  

     @InjectRepository(CreatorProfile)
    private creatorRepo: Repository<CreatorProfile>,

  ) {}

    async create(dto: CreateChatRequestDto, businessId: string) {

      // default assume frontend sent userId
      let creatorUserId = dto.creatorId;

      // check if it is actually a profileId
      const profile = await this.creatorRepo.findOne({
        where: { id: dto.creatorId },
        relations: ["user"],
      });

      if (profile) {
        creatorUserId = profile.user.id;
      }

      const request = await this.repo.save({
        ...dto,
        business: { id: businessId },
        creator: { id: creatorUserId },  //use resolved id
      });

      // notify creator
      await this.notifications.create(
        creatorUserId,   // ⭐ use resolved id
        "CHAT_REQUEST",
        "You received a new collaboration request",
        request.id,
      );

      return request;
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

    const conversation = await this.convoRepo.save({
        creator: request.creator,
        business: request.business,
        request,
    });

    // notify business
    await this.notifications.create(
        request.business.id,
        "REQUEST_ACCEPTED",
        "Your collaboration request was accepted 🎉",
        request.id,
    );

    return conversation;
    }
    reject(requestId: string) {
    return this.repo.update(requestId, {
        status: "REJECTED",
    });
    }
}