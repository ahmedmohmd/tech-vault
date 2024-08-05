import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Repository } from "typeorm";
import { Logger } from "winston";
import { MailService } from "../mail/mail.service";
import { NotificationsService } from "../notifications/notifications.service";
import { Category } from "./category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesService {
	constructor(
		@InjectRepository(Category)
		private readonly categoriesRepository: Repository<Category>,
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
		private readonly mailService: MailService,
		private readonly notificationsService: NotificationsService
	) {}

	public async getAllCategories() {
		this.logger.info("Fetching all categories.");

		const allCategories = await this.categoriesRepository.find({
			order: {
				name: "ASC",
			},
		});

		this.logger.info(
			`Fetched ${allCategories.length} categories successfully.`
		);

		return allCategories;
	}

	public async getSingleCategory(categoryId: number) {
		this.logger.info(`Fetching category with ID: ${categoryId}`);
		const isCategoryExists = await this.isCategoryExists(categoryId);

		if (!isCategoryExists) {
			this.logger.warn(`Category with ID ${categoryId} not found.`);
			throw new NotFoundException("Category not found.");
		}

		const targetCategory = await this.categoriesRepository.findOne({
			where: {
				id: categoryId,
			},
		});

		this.logger.info(`Fetched category with ID ${categoryId} successfully.`);

		return targetCategory;
	}

	public async createCategory(categoryData: CreateCategoryDto) {
		this.logger.info(
			`Creating a new category with data: ${JSON.stringify(categoryData)}`
		);

		const createdCategory = this.categoriesRepository.create(categoryData);

		const savedCategory = await this.categoriesRepository.save(createdCategory);
		this.logger.info(
			`Category created successfully with ID: ${savedCategory.id}`
		);

		return savedCategory;
	}

	public async updateCategory(
		categoryId: number,
		categoryData: UpdateCategoryDto
	) {
		this.logger.info(
			`Updating category with ID: ${categoryId} with data: ${JSON.stringify(categoryData)}`
		);

		const isCategoryExists = await this.isCategoryExists(categoryId);

		if (!isCategoryExists) {
			this.logger.info(`Category with Id: ${categoryId} is not Found.`);

			throw new NotFoundException("Category not found.");
		}

		const targetCategory = await this.categoriesRepository.findOne({
			where: {
				id: categoryId,
			},
		});

		const updatedCategory = Object.assign(targetCategory, categoryData);

		const savedCategory = await this.categoriesRepository.save(updatedCategory);
		this.logger.info(
			`Category updated successfully with ID: ${savedCategory.id}`
		);

		return savedCategory;
	}

	public async deleteCategory(categoryId: number) {
		this.logger.info(`Attempting to delete category with ID: ${categoryId}`);
		const isCategoryExists = await this.isCategoryExists(categoryId);

		if (!isCategoryExists) {
			this.logger.info(`Category with Id: ${categoryId} is not Found.`);
			throw new NotFoundException("Category not found.");
		}

		const targetCategory = await this.categoriesRepository.findOne({
			where: {
				id: categoryId,
			},
		});

		await this.categoriesRepository.remove(targetCategory);

		this.logger.info(`Category with ID: ${categoryId} deleted successfully.`);

		return;
	}

	public async isCategoryExists(categoryId: number) {
		return await this.categoriesRepository.exists({
			where: {
				id: categoryId,
			},
		});
	}
}
