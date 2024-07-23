import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { InvoicesService } from "./invoices.service";

@Controller("invoices")
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get(":orderId")
  public async createInvoice(@Param("orderId", ParseIntPipe) orderId: number) {
    return await this.invoicesService.createInvoice(orderId);
  }
}
