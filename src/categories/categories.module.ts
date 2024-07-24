import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { Category } from "./category.entity";

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [TypeOrmModule.forFeature([Category]), UsersModule],
  exports: [CategoriesService],
})
export class CategoriesModule {}
