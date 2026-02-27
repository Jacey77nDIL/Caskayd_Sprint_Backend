import { Controller, Post,Param, Get, Body, Req, UseGuards, Headers, ForbiddenException } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UsersService } from "../users/users.service";
import { PaystackService } from "./paystack.service";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
@Controller("payments")
export class PaymentController {
  constructor(
    private paymentService: PaymentService,
    private usersService: UsersService,
    private paystackService: PaystackService,
  ) {}


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("business")
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("creator")
  @Get("earnings")
async getEarnings(@Req() req) {
  return this.paymentService.getCreatorEarnings(req.user.id);
}

@UseGuards(JwtAuthGuard)
  @Get("banks")
  async getBanks() {
    const banks = await this.paystackService.getBanks();

    return banks.map(bank => ({
      name: bank.name,
      code: bank.code,
    }));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Get("admin/revenue")
async getRevenue() {
  return this.paymentService.getAdminRevenue();
}

  @Get("verify/:reference")
@UseGuards(JwtAuthGuard)
async verify(@Param("reference") reference: string) {
  const payment = await this.paystackService.verifyPayment(reference);

  return {
    reference,
    status: payment.status,
    amount: payment.amount / 100,
  };
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