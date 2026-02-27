import { Controller, Post, Body, Req, UseGuards, Headers, ForbiddenException } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UsersService } from "../users/users.service";
import { PaystackService } from "./paystack.service";

@Controller("payments")
export class PaymentController {
  constructor(
    private paymentService: PaymentService,
    private usersService: UsersService,
    private paystackService: PaystackService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post("pay")
  async payCreator(
    @Req() req,
    @Body() dto: { creatorId: string; amount: number }
  ) {
    const business = req.user;
    const creator = await this.usersService.findById(dto.creatorId);

    return this.paymentService.payCreator(
      business,
      creator,
      dto.amount
    );
  }


  @UseGuards(JwtAuthGuard)
    @Post("verify")
    async verify(
    @Req() req,
    @Body() body: {
        reference: string;
        creatorId: string;
        amount: number;
    }
    ) {
    const business = req.user;
    const creator = await this.usersService.findById(body.creatorId);

    const payment = await this.paystackService.verifyPayment(
        body.reference
    );

    if (payment.status === "success") {
        await this.paymentService.savePayment(
        business,
        creator,
        body.amount,
        body.reference,
        "success"
        );
    }

    return payment;
    }

  @UseGuards(JwtAuthGuard)
    @Post("simulate")
    async simulate(
    @Req() req,
    @Body() dto: { creatorId: string; amount: number }
    ) {
    const business = await this.usersService.findById(req.user.userId);
    const creator = await this.usersService.findById(dto.creatorId);

    return this.paymentService.simulatePayment(
        business,
        creator,
        dto.amount
    );
    }

   @Post("webhook")
async handleWebhook(
  @Req() req: any,
  @Headers("x-paystack-signature") signature: string
) {
  const isValid = this.paystackService.verifyWebhookSignature(
    signature,
    req.rawBody,
  );

  if (!isValid) {
    throw new ForbiddenException("Invalid signature");
  }

  const event = req.body;

  if (event.event === "charge.success") {
    const reference = event.data.reference;
    await this.paymentService.markAsPaid(reference);
  }

  return { received: true };
 }
}