import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UsersController } from "./users.controller";
import { CreatorModule } from "../creator/creator.module";
import { BusinessModule } from "../business/business.module";
import { UploadModule } from "../aws/upload.module";
import { forwardRef } from '@nestjs/common';
import { PaymentsModule } from '../payment/payment.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
    CreatorModule,
    BusinessModule, 
  UploadModule,
forwardRef(() => PaymentsModule)],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}