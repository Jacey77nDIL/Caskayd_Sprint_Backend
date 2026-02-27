import { Injectable, BadRequestException } from "@nestjs/common";
import axios from "axios";
import * as crypto from "crypto";

@Injectable()
export class PaystackService {
  private baseUrl = "https://api.paystack.co";
  private secret = process.env.PAYSTACK_SECRET_KEY;

  private get headers() {
    return {
      Authorization: `Bearer ${this.secret}`,
      "Content-Type": "application/json",
    };
  }

  async initializeSplitPayment(params: {
    email: string;
    amount: number; // in kobo
    subaccount: string;
    platformFee: number; // in kobo
    reference: string;
    metadata?: any;
  }) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/transaction/initialize`,
        {
          email: params.email,
          amount: params.amount,
          reference: params.reference,
          subaccount: params.subaccount,
          transaction_charge: params.platformFee,
          bearer: "account",
          metadata: params.metadata || {},
        },
        { headers: this.headers }
      );

      return response.data.data;
    } catch (error) {
      throw new BadRequestException(
        error.response?.data?.message || "Paystack initialization failed"
      );
    }
  }

  async verifyPayment(reference: string) {
    const response = await axios.get(
      `${this.baseUrl}/transaction/verify/${reference}`,
      { headers: this.headers }
    );

    return response.data.data;
  }

  verifyWebhookSignature(signature: string, rawBody: Buffer) {
    const hash = crypto
      .createHmac("sha512", this.secret)
      .update(rawBody)
      .digest("hex");

    return hash === signature;
  }

  async createSubaccount(data: {
  business_name: string;
  settlement_bank: string;
  account_number: string;
  percentage_charge?: number;
}) {
  const response = await axios.post(
    "https://api.paystack.co/subaccount",
    {
      ...data,
      percentage_charge: 0, // we control fee manually
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data;
}

async getBanks() {
  const response = await axios.get(
    "https://api.paystack.co/bank",
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  return response.data.data;
}
}