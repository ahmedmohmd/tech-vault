import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Roles } from "../users/decorators/roles.decorator";
import { Role } from "../users/enums/user-role.enum";
import { RolesGuard } from "../users/guards/roles.guard";
import { InvoicesService } from "./invoices.service";

@ApiBearerAuth()
@ApiTags("Invoices")
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("invoices")
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get(":orderId")
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: "Create an invoice for a specific order." })
  @ApiParam({
    name: "orderId",
    description: "ID of the order for which to create an invoice.",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Invoice created successfully.",
  })
  @ApiResponse({
    status: 404,
    description: "Order not found.",
  })
  public async createInvoice(@Param("orderId", ParseIntPipe) orderId: number) {
    return await this.invoicesService.createInvoice(orderId);
  }
}
