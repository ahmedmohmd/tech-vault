import { Controller, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { User } from 'src/common/decorators/user/user.decorator';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Get()
  public async getAllNotifications(@User() user) {
    return await this.notificationService.findAllNotifications(user?.userId);
  }

  @Patch(':notificationId')
  public async markAsRead(
    @User() user,
    @Param('notificationId', ParseIntPipe) notificationId: number,
  ) {
    return await this.notificationService.markAsRead(
      user?.userId,
      notificationId,
    );
  }
}
