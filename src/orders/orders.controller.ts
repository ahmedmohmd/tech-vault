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
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { User } from "../common/decorators/user/user.decorator";
import { Serialize } from "../common/interceptors/serialize/serialize.decorator";
import { Roles } from "../users/decorators/roles.decorator";
import { Role } from "../users/enums/user-role.enum";
import { RolesGuard } from "../users/guards/roles.guard";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrderDto } from "./dto/order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { OrdersService } from "./orders.service";

@ApiBearerAuth()
@ApiTags("Orders")
@Controller("orders")
@UseGuards(JwtAuthGuard, RolesGuard)
@Serialize(OrderDto)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: "Get all orders." })
  @ApiResponse({
    status: 200,
    description: "Array of orders.",
    isArray: true,
    type: OrderDto,
  })
  public async getAllOrders() {
    return await this.ordersService.findAllOrders();
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get(":order_id")
  @ApiOperation({ summary: "Get a single order by ID." })
  @ApiResponse({
    status: 200,
    description: "The order with the specified ID.",
    type: OrderDto,
  })
  @ApiResponse({
    status: 404,
    description: "Order not found.",
  })
  @ApiParam({
    name: "order_id",
    description: "ID of the order to retrieve.",
    type: Number,
    example: 1,
  })
  public async getSingleOrder(
    @Param("order_id", ParseIntPipe) orderId: number,
  ) {
    return await this.ordersService.findOrderById(orderId);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Post()
  @ApiOperation({ summary: "Create a new order." })
  @ApiResponse({
    status: 201,
    description: "The newly created order.",
    type: OrderDto,
  })
  @ApiBody({
    description: "The order details.",
    type: CreateOrderDto,
  })
  public async createOrder(@User() user, @Body() body: CreateOrderDto) {
    console.log(user);

    return await this.ordersService.createOrder(user?.userId, body);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Patch(":order_id")
  @ApiOperation({ summary: "Update the status of an order." })
  @ApiResponse({
    status: 200,
    description: "The updated order.",
    type: OrderDto,
  })
  @ApiResponse({
    status: 404,
    description: "Order not found.",
  })
  @ApiParam({
    name: "order_id",
    description: "ID of the order to update.",
    type: Number,
    example: 1,
  })
  @ApiBody({
    description: "The new status of the order.",
    type: UpdateOrderStatusDto,
  })
  public async updateOrderStatus(
    @Param("order_id", ParseIntPipe) orderId: number,
    @Body() body: UpdateOrderStatusDto,
  ) {
    return await this.ordersService.updateOrderStatus(orderId, body.status);
  }

  @Roles(Role.ADMIN)
  @Delete(":order_id")
  @ApiOperation({ summary: "Delete an order by ID." })
  @ApiResponse({
    status: 200,
    description: "The deleted order.",
    type: OrderDto,
  })
  @ApiResponse({
    status: 404,
    description: "Order not found.",
  })
  @ApiParam({
    name: "order_id",
    description: "ID of the order to delete.",
    type: Number,
    example: 1,
  })
  public async DeleteOrder(@Param("order_id", ParseIntPipe) orderId: number) {
    return await this.ordersService.deleteOrder(orderId);
  }
}
