import { Controller, Param, Post, Req } from "@nestjs/common";
import { PaymentsService } from "./payments.service";

@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post("create-payment-intent/:orderId")
  createPaymentIntent(@Param("orderId") orderId: number) {
    return this.paymentsService.createPaymentIntent(orderId);
  }

  @Post("webhook")
  async handleWebhook(@Req() request: Request) {
    const sig = request.headers["stripe-signature"];
    const stripeEvent = this.paymentsService.stripe.webhooks.constructEvent(
      JSON.stringify(request.body),
      sig,
      "YOUR_STRIPE_WEBHOOK_SECRET",
    );

    await this.paymentsService.handleWebhook(stripeEvent);
  }

  @Post("paypal/create-order/:orderId")
  createPaypalOrder(@Param("orderId") orderId: number) {
    return this.paymentsService.createOrder(orderId);
  }

  @Post("paypal/capture-order/:orderId")
  capturePaypalOrder(@Param("orderId") orderId: string) {
    return this.paymentsService.captureOrder(orderId);
  }
}
