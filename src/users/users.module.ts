import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UsersController } from "./users.controller";
import { CreatorModule } from "../creator/creator.module";
import { BusinessModule } from "../business/business.module";
import { UploadModule } from "../aws/upload.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]),
    CreatorModule,
    BusinessModule, 
  UploadModule,],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}