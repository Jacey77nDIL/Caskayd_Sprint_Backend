import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CreatorProfile } from "../creator/creator.entity";
import { ResolveUserIdService } from "./resolve-user-id.service";

@Module({
  imports: [TypeOrmModule.forFeature([CreatorProfile])],
  providers: [ResolveUserIdService],
  exports: [ResolveUserIdService], 
})
export class CommonModule {}