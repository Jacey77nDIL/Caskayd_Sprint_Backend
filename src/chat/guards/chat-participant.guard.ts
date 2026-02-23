import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Conversation } from "../conversation.entity";

@Injectable()
export class ChatParticipantGuard implements CanActivate {
  constructor(
    @InjectRepository(Conversation)
    private convoRepo: Repository<Conversation>,
  ) {}

 async canActivate(context: ExecutionContext): Promise<boolean> {
  const request = context.switchToHttp().getRequest();
  const user = request.user;

  const userId = user.sub;   // ✅ FIX

  const conversationId =
    request.params.conversationId || request.body.conversationId;

  if (!conversationId) return true;

  const conversation = await this.convoRepo.findOne({
    where: { id: conversationId },
    relations: ["creator", "business"],
  });

  if (!conversation)
    throw new ForbiddenException("Conversation not found");

  const isParticipant =
    conversation.creator.id === userId ||
    conversation.business.id === userId;

  if (!isParticipant)
    throw new ForbiddenException("Access denied");

  return true;
}
}