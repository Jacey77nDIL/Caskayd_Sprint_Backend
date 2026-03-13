import { CreateChatRequestDto } from "./dto/create-chat-request.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ChatRequest } from "./chat-request.entity";
import { Conversation } from "./conversation.entity";
import { NotificationsService } from "../notifications/notifications.service";
import { ResolveUserIdService } from "../helper/resolve-user-id.service";
import { NotFoundException } from "@nestjs/common";

@Injectable()
export class ChatRequestService {
  constructor(
    @InjectRepository(ChatRequest)
    private repo: Repository<ChatRequest>,
    private notifications: NotificationsService,

    @InjectRepository(Conversation)
    private convoRepo: Repository<Conversation>,  


    private resolveUserIdService: ResolveUserIdService,
  ) {}

   async create(dto: CreateChatRequestDto, businessId: string) {

    const creatorUserId =
      await this.resolveUserIdService.resolveUserId(dto.creatorId);

    const request = await this.repo.save({
      ...dto,
      business: { id: businessId },
      creator: { id: creatorUserId },
    });

    await this.notifications.create(
      creatorUserId,
      "CHAT_REQUEST",
      "You received a new collaboration request",
      request.id,
    );

    return request;
  }

async findForCreator(id: string) {

  const userId =
    await this.resolveUserIdService.resolveUserId(id);

  const requests = await this.repo
    .createQueryBuilder("request")
    .leftJoinAndSelect("request.business", "business")
    .leftJoin("business_profile", "businessProfile", "businessProfile.userId = business.id")
    .where("request.creatorId = :userId", { userId })
    .andWhere("request.status = :status", { status: "PENDING" })
    .orderBy("request.createdAt", "DESC")
    .getMany();

  return requests.map((req: any) => ({
    id: req.id,
    message: req.message,
    proposedPrice: req.proposedPrice,
    createdAt: req.createdAt,

    businessId: req.business.id,
    avatar: req.business.avatar,

    displayName:
      req.businessProfile?.companyName ||
      "Business",
  }));
}


    async accept(requestId: string) {
    const request = await this.repo.findOne({
    where: { id: requestId },
    relations: ["creator", "business"],
  });

  if (!request) {
    throw new NotFoundException("Request not found");
  }

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

    async countAcceptedByCreator(creatorId: string) {
    const userId =
      await this.resolveUserIdService.resolveUserId(creatorId);

    return this.repo.count({
      where: {
        creator: { id: userId },
        status: "ACCEPTED",
      },
    });
  }

async countSentByBusiness(businessId: string) {
  return this.repo.count({
    where: {
      business: { id: businessId },
    },
  });
}

}