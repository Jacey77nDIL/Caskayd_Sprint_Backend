import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatorProfile } from "../creator/creator.entity";
import { validate as isUUID } from "uuid";

@Injectable()
export class ResolveUserIdService {
  constructor(
    @InjectRepository(CreatorProfile)
    private creatorRepo: Repository<CreatorProfile>,
  ) {}

  async resolveIds(
    id: string,
  ): Promise<{ userId: string; profileId?: string }> {

    const profile = await this.creatorRepo.findOne({
      where: { id },
      relations: ["user"],
    });

    // ✅ if profileId → convert
    if (profile) {
      return {
        userId: profile.user.id,
        profileId: profile.id,
      };
    }

    // ❌ invalid id format
    if (!isUUID(id)) {
      throw new NotFoundException("Invalid creator id");
    }

    // ✅ already a userId
    return { userId: id };
  }
    async resolveUserId(id: string): Promise<string> {
    const { userId } = await this.resolveIds(id);
    return userId;
    }
}