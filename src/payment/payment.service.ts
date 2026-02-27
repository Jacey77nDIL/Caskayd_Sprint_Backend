import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Payment } from "./payment.entity";
import { PaymentMethod } from "./business-card.entity";


import { User } from "../users/user.entity";
import { Conversation } from "../chat/conversation.entity";

import { PaystackService } from "./paystack.service";


const PLATFORM_FEE = 0.10;

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,

    @InjectRepository(PaymentMethod)
    private methodRepo: Repository<PaymentMethod>,

    @InjectRepository(Conversation)
    private convoRepo: Repository<Conversation>,

    
    private paystackService: PaystackService,
  ) {}



  async payCreator(business: User, creator: User, amount: number) {
  if (!creator.subaccountCode) {
    throw new BadRequestException(
      "Creator is not configured for payouts"
    );
  }

  const platformFee = Math.round(amount * 0.10);
  const reference = `EDGE_${Date.now()}_${business.id}`;

  // 1️⃣ Save pending record first
  const payment = this.paymentRepo.create({
    business,
    creator,
    amount,
    adminFee: platformFee,
    creatorAmount: amount,
    totalPaid: amount,
    reference,
    status: "pending",
  });

  await this.paymentRepo.save(payment);

  // 2 Initialize split payment
  const response = await this.paystackService.initializeSplitPayment({
    email: business.email,
    amount: amount * 100,
    subaccount: creator.subaccountCode,
    platformFee: platformFee * 100,
    reference,
    metadata: {
      businessId: business.id,
      creatorId: creator.id,
    },
  });

  return {
    paymentUrl: response.authorization_url,
    reference,
  };
}

async savePayment(
  business: User,
  creator: User,
  amount: number,
  reference: string,
  status: string,
) {
  const adminFee = Math.round(amount * PLATFORM_FEE);
  const totalPaid = amount + adminFee;

  const payment = this.paymentRepo.create({
    business,
    creator,
    amount,
    adminFee,
    creatorAmount: amount,
    totalPaid,
    reference,
    status,
  });

  return this.paymentRepo.save(payment);
 }

 async simulatePayment(
  business: User,
  creator: User,
  amount: number,
) {
  const reference = "SIM_" + Date.now();

  return this.savePayment(
    business,
    creator,
    amount,
    reference,
    "success",
  );
 }

async markAsPaid(reference: string) {
  const payment = await this.paymentRepo.findOne({
    where: { reference },
    relations: ["creator"],
  });

  if (!payment) return;

  if (payment.status === "success") return; // idempotent

  payment.status = "success";

  await this.paymentRepo.save(payment);

  console.log("Payment marked as success:", reference);
 }
}