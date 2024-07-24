import { Controller, Param, Post, Req } from "@nestjs/common";
import {
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { PaymentsService } from "./payments.service";

@ApiTags("Payments")
@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post("create-payment-intent/:orderId")
  @ApiOperation({ summary: "Create a payment intent" })
  @ApiResponse({
    status: 200,
    description: "Payment intent created successfully",
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiForbiddenResponse({ status: 403, description: "Forbidden." })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: "Internal server error",
  })
  createPaymentIntent(@Param("orderId") orderId: number) {
    return this.paymentsService.createPaymentIntent(orderId);
  }

  @Post("webhook")
  @ApiOperation({ summary: "Handle Stripe webhook" })
  @ApiResponse({
    status: 200,
    description: "Webhook handled successfully",
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiForbiddenResponse({ status: 403, description: "Forbidden." })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: "Internal server error",
  })
  async handleWebhook(@Req() request: Request) {
    const sig = request.headers["stripe-signature"];
    const stripeEvent = this.paymentsService.stripe.webhooks.constructEvent(
      JSON.stringify(request.body),
      sig,
      "STRIPE_WEBHOOK_SECRET",
    );

    await this.paymentsService.handleWebhook(stripeEvent);
  }
}
