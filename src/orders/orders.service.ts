import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './enums/order-status.enum';
import { OrderItem } from './order-item.entity';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,

    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  public async createOrder({
    items,
    userId,
    discount,
  }: CreateOrderDto): Promise<Order> {
    const targetUser = await this.usersService.findUser(userId);

    if (!targetUser) {
      throw new NotFoundException('User not Found.');
    }

    const orderItems: OrderItem[] = [];
    let total = 0;

    for (const item of items) {
      const product = await this.productsService.getProduct(item.productId);

      if (!product) {
        throw new NotFoundException(
          `Sorry, Product with ID: ${item.productId} not Found.`,
        );
      }

      const createdOrderItem = this.orderItemsRepository.create({
        price: product.price * item.quantity,
        quantity: item.quantity,
        product: product,
      });

      orderItems.push(createdOrderItem);
      total += createdOrderItem.price;
    }

    const createdOrder = await this.ordersRepository.create({
      user: targetUser,
      items: orderItems,
      status: OrderStatus.PLACED,
      total: total,
      discount: discount,
    });

    return await this.ordersRepository.save(createdOrder);
  }

  public async findAllOrders(): Promise<Order[]> {
    return await this.ordersRepository.find({
      relations: ['user', 'items', 'items.product'],
    });
  }

  public async findOrderById(orderId: number): Promise<Order> {
    const isOrderExists = await this.isOrderExists(orderId);

    if (!isOrderExists) {
      throw new NotFoundException('Order not Found.');
    }

    return await this.ordersRepository.findOne({
      where: {
        id: orderId,
      },
      relations: ['user', 'items', 'items.product'],
    });
  }

  public async isOrderExists(orderId: number): Promise<boolean> {
    return await this.ordersRepository.exists({
      where: {
        id: orderId,
      },
    });
  }

  public async updateOrderStatus(
    orderId: number,
    status: OrderStatus,
  ): Promise<Order> {
    const isOrderExists = await this.isOrderExists(orderId);

    if (!isOrderExists) {
      throw new NotFoundException('Order not Found.');
    }

    const targetOrder = await this.ordersRepository.findOne({
      where: {
        id: orderId,
      },
      relations: ['user', 'items', 'items.product'],
    });

    targetOrder.status = status;

    return await this.ordersRepository.save(targetOrder);
  }

  public async deleteOrder(orderId: number): Promise<Order> {
    const isOrderExists = await this.isOrderExists(orderId);

    if (!isOrderExists) {
      throw new NotFoundException('Order not Found.');
    }

    const targetOrder = await this.ordersRepository.findOne({
      where: {
        id: orderId,
      },
      relations: ['user', 'items', 'items.product'],
    });

    return await this.ordersRepository.remove(targetOrder);
  }
}
