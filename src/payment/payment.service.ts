import { Injectable } from "@nestjs/common";
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
    const adminFee = Math.round(amount * PLATFORM_FEE);
    const total = amount + adminFee;

    const payment = await this.paystackService.initializePayment(
      business.email,
      total   // business pays total
    );

    return {
      paymentUrl: payment.authorization_url,
      reference: payment.reference,
      creatorPrice: amount,
      platformFee: adminFee,
      totalPayable: total,
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
      amount,               // creator price
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

    const payment = await this.savePayment(
      business,
      creator,
      amount,
      reference,
      "success"
    );

    console.log("Payment saved:", payment);

    return {
        message: "Payment simulated successfully",
        creatorPrice: payment.amount,
        platformFee: payment.adminFee,
        totalPaidByBusiness: payment.totalPaid,
        creatorReceives: payment.creatorAmount,
        reference: payment.reference,
          };
    
  }
}