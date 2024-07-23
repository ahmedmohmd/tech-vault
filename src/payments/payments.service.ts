import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as paypal from "@paypal/checkout-server-sdk";
import Stripe from "stripe";
import { Repository } from "typeorm";
import { OrderStatus } from "../orders/enums/order-status.enum";
import { Order } from "../orders/order.entity";
import { OrdersService } from "../orders/orders.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class PaymentsService {
  public readonly stripe: Stripe = new Stripe(
    "sk_test_51PcXZgIgkBQ5uySUiMxFnqBqC7KrmQHAXmULQoSSA5m9Namq0WkDGjktwaqY1swiQE2H2riOAHMW7WJ8a4EQo0lJ00zfydquvR",
    {
      apiVersion: "2024-06-20",
    },
  );

  private environment: paypal.core.SandboxEnvironment;
  private client: paypal.core.PayPalHttpClient;

  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
  ) {}

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

  public async createOrder(orderId: number) {
    const targetOrder = await this.ordersService.findOrderById(orderId);

    if (!targetOrder) {
      throw new NotFoundException("Order not Found.");
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: (targetOrder.total = targetOrder.discount).toString(),
          },
        },
      ],
    });

    const response = await this.client.execute(request);
    return response.result;
  }

  async captureOrder(orderId: string) {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const response = await this.client.execute(request);
    return response.result;
  }
}
