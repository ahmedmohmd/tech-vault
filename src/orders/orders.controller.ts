import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Serialize } from '../common/interceptors/serialize/serialize.decorator';
import { Roles } from '../users/decorators/roles.decorator';
import { Role } from '../users/enums/user-role.enum';
import { RolesGuard } from '../users/guards/roles.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderDto } from './dto/order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Serialize(OrderDto)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  public async getAllOrders() {
    return await this.ordersService.findAllOrders();
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get(':orderId')
  public async getSingleOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return await this.ordersService.findOrderById(orderId);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Post()
  public async createOrder(@Body() body: CreateOrderDto) {
    return await this.ordersService.createOrder(body);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Patch(':orderId')
  public async updateOrderStatus(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() body: UpdateOrderStatusDto,
  ) {
    return await this.ordersService.updateOrderStatus(orderId, body.status);
  }

  @Roles(Role.ADMIN)
  @Delete(':orderId')
  public async DeleteOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return await this.ordersService.deleteOrder(orderId);
  }
}
