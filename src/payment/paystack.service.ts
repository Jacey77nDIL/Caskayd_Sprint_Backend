import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class PaystackService {
  private baseUrl = "https://api.paystack.co";

  async initializePayment(email: string, amount: number) {
    const response = await axios.post(
      `${this.baseUrl}/transaction/initialize`,
      {
        email,
        amount: amount * 100, // convert to kobo
        split_code: process.env.PAYSTACK_SPLIT_CODE,
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

  async verifyPayment(reference: string) {
    const response = await axios.get(
      `${this.baseUrl}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return response.data.data;
  }
}