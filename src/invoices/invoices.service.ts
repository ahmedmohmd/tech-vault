import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class InvoicesService {
  constructor(private readonly ordersService: OrdersService) {}

  public async createInvoice(orderId: number) {
    const isOrderExists = await this.ordersService.isOrderExists(orderId);

    if (!isOrderExists) {
      throw new NotFoundException('Order not Found.');
    }

    const targetOrder = await this.ordersService.findOrderById(orderId);

    const invoiceData = {
      orderId: targetOrder.id,
      customer: {
        name: `${targetOrder.user.firstName} $`,
        email: targetOrder.user.email,
      },
      items: targetOrder.items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: targetOrder.total,
      date: targetOrder.createdAt,
    };

    await fs.writeFile(
      path.join(__dirname, '..', '..', 'invoices', `${Math.random()}.json`),
      JSON.stringify(invoiceData),
      'utf-8',
    );

    return {
      message: 'Invoice Created Successfully.',
    };
  }
}
