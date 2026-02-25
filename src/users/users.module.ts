import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UsersController } from "./users.controller";
import { CreatorModule } from "../creator/creator.module";
import { BusinessModule } from "../business/business.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]),
    CreatorModule,
    BusinessModule, ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}