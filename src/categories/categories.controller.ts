import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  public async getAllCategories() {
    return await this.categoriesService.getAllCategories();
  }

  @Get(':categoryId')
  public async getSingleCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return await this.categoriesService.getSingleCategory(categoryId);
  }

  @Post()
  public async createCategory(@Body() body: CreateCategoryDto) {
    return await this.categoriesService.createCategory(body);
  }

  @Patch(':categoryId')
  public async updateCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() body: UpdateCategoryDto,
  ) {
    return await this.categoriesService.updateCategory(categoryId, body);
  }

  @Delete(':categoryId')
  public async deleteCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return await this.categoriesService.deleteCategory(categoryId);
  }
}
