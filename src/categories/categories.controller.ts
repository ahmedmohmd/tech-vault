import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@ApiTags("Categories")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: "Get all categories" })
  @ApiOkResponse({
    description: "List of all categories",
    schema: {
      example: [
        { id: 1, name: "Electronics", description: "Electronic products" },
        { id: 2, name: "Books", description: "Books and literature" },
      ],
    },
  })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  public async getAllCategories() {
    return await this.categoriesService.getAllCategories();
  }

  @Get(":category_id")
  @ApiOperation({ summary: "Get a single category by ID" })
  @ApiParam({
    name: "category_id",
    description: "The ID of the category to retrieve",
    example: 1,
  })
  @ApiOkResponse({
    description: "The category details",
    schema: {
      example: {
        id: 1,
        name: "Electronics",
        description: "Electronic products",
      },
    },
  })
  @ApiNotFoundResponse({ description: "Category not found" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  public async getSingleCategory(
    @Param("category_id", ParseIntPipe) categoryId: number,
  ) {
    return await this.categoriesService.getSingleCategory(categoryId);
  }

  @Post()
  @ApiOperation({ summary: "Create a new category" })
  @ApiCreatedResponse({
    description: "The created category",
    schema: {
      example: {
        id: 1,
        name: "Electronics",
        description: "Electronic products",
      },
    },
  })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @ApiBody({ type: CreateCategoryDto })
  public async createCategory(@Body() body: CreateCategoryDto) {
    return await this.categoriesService.createCategory(body);
  }

  @Patch(":category_id")
  @ApiOperation({ summary: "Update an existing category" })
  @ApiParam({
    name: "category_id",
    description: "The ID of the category to update",
    example: 1,
  })
  @ApiOkResponse({
    description: "The updated category",
    schema: {
      example: {
        id: 1,
        name: "Electronics",
        description: "Updated description",
      },
    },
  })
  @ApiNotFoundResponse({ description: "Category not found" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @ApiBody({ type: UpdateCategoryDto })
  public async updateCategory(
    @Param("category_id", ParseIntPipe) categoryId: number,
    @Body() body: UpdateCategoryDto,
  ) {
    return await this.categoriesService.updateCategory(categoryId, body);
  }

  @Delete(":category_id")
  @ApiOperation({ summary: "Delete a category by ID" })
  @ApiParam({
    name: "category_id",
    description: "The ID of the category to delete",
    example: 1,
  })
  @ApiOkResponse({ description: "The category was deleted successfully" })
  @ApiNotFoundResponse({ description: "Category not found" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  public async deleteCategory(
    @Param("category_id", ParseIntPipe) categoryId: number,
  ) {
    return await this.categoriesService.deleteCategory(categoryId);
  }
}
