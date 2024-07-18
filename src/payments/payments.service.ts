import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatus } from 'src/orders/enums/order-status.enum';
import { Order } from 'src/orders/order.entity';
import { UsersService } from 'src/users/users.service';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsService {
  public readonly stripe: Stripe = new Stripe(
    'sk_test_51PcXZgIgkBQ5uySUiMxFnqBqC7KrmQHAXmULQoSSA5m9Namq0WkDGjktwaqY1swiQE2H2riOAHMW7WJ8a4EQo0lJ00zfydquvR',
    {
      apiVersion: '2024-06-20',
    },
  );

  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly usersService: UsersService,
  ) {}

  async createPaymentIntent(orderId: number): Promise<Stripe.PaymentIntent> {
    const order = await this.ordersRepository.findOne({
      where: {
        id: orderId,
      },

      relations: ['user', 'items', 'items.product'],
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    const orderTotalPrice =
      order.total <= order.discount
        ? 0
        : Math.round(order.total - order.discount);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: orderTotalPrice * 100, // Stripe amount is in cents
      currency: 'usd',
      metadata: { orderId: order.id.toString() },
    });

    return paymentIntent;
  }

  async handleWebhook(event: Stripe.Event): Promise<void> {
    if (event.type === 'payment_intent.succeeded') {
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
