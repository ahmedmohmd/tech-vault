import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  public async getAllCategories() {
    return await this.categoriesRepository.find({
      order: {
        name: "ASC",
      },
    });
  }

  public async getSingleCategory(categoryId: number) {
    const isCategoryExists = await this.isCategoryExists(categoryId);

    if (!isCategoryExists) {
      throw new NotFoundException("Category not found.");
    }

    return await this.categoriesRepository.findOne({
      where: {
        id: categoryId,
      },
    });
  }

  public async createCategory(categoryData: CreateCategoryDto) {
    const createdCategory = this.categoriesRepository.create(categoryData);

    const savedCategory = await this.categoriesRepository.save(createdCategory);

    return savedCategory;
  }

  public async updateCategory(
    categoryId: number,
    categoryData: UpdateCategoryDto,
  ) {
    const isCategoryExists = await this.isCategoryExists(categoryId);

    if (!isCategoryExists) {
      throw new NotFoundException("Category not found.");
    }

    const targetCategory = await this.categoriesRepository.findOne({
      where: {
        id: categoryId,
      },
    });

    const updatedCategory = Object.assign(targetCategory, categoryData);

    const savedCategory = await this.categoriesRepository.save(updatedCategory);

    return savedCategory;
  }

  public async deleteCategory(categoryId: number) {
    const isCategoryExists = await this.isCategoryExists(categoryId);

    if (!isCategoryExists) {
      throw new NotFoundException("Category not found.");
    }

    const targetCategory = await this.categoriesRepository.findOne({
      where: {
        id: categoryId,
      },
    });

    await this.categoriesRepository.remove(targetCategory);
  }

  public async isCategoryExists(categoryId: number) {
    return await this.categoriesRepository.exists({
      where: {
        id: categoryId,
      },
    });
  }
}
