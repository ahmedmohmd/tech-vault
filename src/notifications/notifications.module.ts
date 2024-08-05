import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { Notification } from "./notification.entity";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";

@Global()
@Module({
	controllers: [NotificationsController],
	providers: [NotificationsService],
	imports: [TypeOrmModule.forFeature([Notification]), UsersModule],
})
export class NotificationsModule {
	static forRoot() {
		return {
			module: NotificationsModule,
			exports: [NotificationsService],
			providers: [NotificationsService],
		};
	}
}
