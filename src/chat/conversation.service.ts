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

  async findUserConversations(userId: string) {

  const conversations = await this.repo
    .createQueryBuilder("conversation")
    .leftJoinAndSelect("conversation.creator", "creator")
    .leftJoinAndSelect("conversation.business", "business")
    .leftJoin("creator_profile", "creatorProfile", "creatorProfile.userId = creator.id")
    .leftJoin("business_profile", "businessProfile", "businessProfile.userId = business.id")
    .orderBy("conversation.createdAt", "DESC")
    .getMany();

  return conversations.map((conv: any) => {

    const isCreator = conv.creator.id === userId;

    const otherUser = isCreator ? conv.business : conv.creator;

    return {
      conversationId: conv.id,

      userId: otherUser.id,

      avatar: otherUser.avatar,

      displayName:
        isCreator
          ? conv.businessProfile?.companyName
          : conv.creatorProfile?.displayName,
    };
  });
}


}