import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { Notification } from "./notification.entity";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
    private readonly usersService: UsersService,
  ) {}

  public async findAllNotifications(userId: number) {
    return await this.notificationsRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  public async createNotification(
    userId: number,
    notificationData: CreateNotificationDto,
  ) {
    const targetUser = await this.usersService.findUser(userId);

    if (!targetUser) {
      throw new NotFoundException("User not Found!");
    }

    const createdNotification = this.notificationsRepository.create({
      ...notificationData,
      user: targetUser,
    });

    return await this.notificationsRepository.save(createdNotification);
  }

  public async markAsRead(userId: number, notificationId: number) {
    const targetUser = await this.usersService.findUser(userId);

    if (!targetUser) {
      throw new NotFoundException("User not Found!");
    }

    const targetNotification = await this.notificationsRepository.findOne({
      where: {
        id: notificationId,
      },
    });

    if (!targetNotification) {
      throw new NotFoundException("Notification not Found!");
    }

    targetNotification.read = true;

    return await this.notificationsRepository.save(targetNotification);
  }
}
