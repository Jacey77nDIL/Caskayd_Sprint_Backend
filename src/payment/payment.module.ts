import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Payment } from "./payment.entity";
import { PaymentMethod } from "./business-card.entity";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";

import { UsersModule } from "../users/users.module";
import { Conversation } from "../chat/conversation.entity";
import { PaystackService } from "./paystack.service";
import { forwardRef } from "@nestjs/common";

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, PaymentMethod, Conversation]),
    forwardRef(() => UsersModule),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaystackService,],
  exports: [PaymentService, PaystackService],
})
export class PaymentsModule {}