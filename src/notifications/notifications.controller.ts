import { Controller, Get, Param, ParseIntPipe, Patch } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { User } from "../common/decorators/user/user.decorator";
import { NotificationsService } from "./notifications.service";

@ApiBearerAuth()
@Controller("notifications")
@ApiTags("Notifications")
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: "Get all notifications for the user." })
  @ApiResponse({
    status: 200,
    description: "Array of notifications.",
    isArray: true,
    example: [
      {
        id: 1,
        message: "You have a new message.",
        userId: 1,
        read: false,
        createdAt: "2024-07-24T12:00:00.000Z",
        updatedAt: "2024-07-24T12:00:00.000Z",
      },
    ],
  })
  public async getAllNotifications(@User() user) {
    return await this.notificationService.findAllNotifications(user?.userId);
  }

  @Patch(":notification_id")
  @ApiOperation({ summary: "Mark a notification as read." })
  @ApiResponse({
    status: 200,
    description: "The notification has been marked as read.",
    example: {
      id: 1,
      message: "You have a new message.",
      userId: 1,
      read: true,
      createdAt: "2024-07-24T12:00:00.000Z",
      updatedAt: "2024-07-24T12:00:00.000Z",
    },
  })
  @ApiResponse({
    status: 404,
    description: "Notification not found.",
  })
  @ApiParam({
    name: "notification_id",
    description: "ID of the notification to mark as read.",
    type: Number,
    example: 1,
  })
  public async markAsRead(
    @User() user,
    @Param("notification_id", ParseIntPipe) notificationId: number,
  ) {
    return await this.notificationService.markAsRead(
      user?.userId,
      notificationId,
    );
  }
}
