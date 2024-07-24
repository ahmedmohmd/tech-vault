import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import * as paypal from "@paypal/checkout-server-sdk";
import Stripe from "stripe";
import { Repository } from "typeorm";
import { OrderStatus } from "../orders/enums/order-status.enum";
import { Order } from "../orders/order.entity";

@Injectable()
export class PaymentsService {
  public readonly stripe: Stripe;
  public readonly environment: paypal.core.SandboxEnvironment;
  public readonly client: paypal.core.PayPalHttpClient;

  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,

    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>("STRIPE_SECRET_KEY"),
      {
        apiVersion: "2024-06-20",
      },
    );
  }

  async createPaymentIntent(orderId: number): Promise<Stripe.PaymentIntent> {
    const order = await this.ordersRepository.findOne({
      where: {
        id: orderId,
      },

      relations: ["user", "items", "items.product"],
    });

    if (!order) {
      throw new BadRequestException("Order not found");
    }

    const orderTotalPrice =
      order.total <= order.discount
        ? 0
        : Math.round(order.total - order.discount);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: orderTotalPrice * 100, // Stripe amount is in cents
      currency: "usd",
      metadata: { orderId: order.id.toString() },
    });

    return paymentIntent;
  }

  async handleWebhook(event: Stripe.Event): Promise<void> {
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;

      const order = await this.ordersRepository.findOne({
        where: {
          id: +orderId,
        },
      });

      if (order) {
        order.status = OrderStatus.PAID;
        await this.ordersRepository.save(order);
      }
    }
  }
}
