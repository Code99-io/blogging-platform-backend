import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { BlogCategoryService } from 'src/modules/blog-category/blog-category.service';
import { CategoryEntity } from './category.entity';
import { BlogCategoryEntity } from 'src/modules/blog-category/blog-category.entity';
import { CreateCategoryDto } from './create-category.dto';
import { UpdateCategoryDto } from './update-category.dto';

@ApiBearerAuth('BearerAuth')
@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(
    private categoryService: CategoryService,
    private blogCategoryService: BlogCategoryService,
  ) {}

  /**
   * Get all blogCategories by categories with pagination support.
   *
   *
   * @param {number} categoryId - The categoryId of the blogCategory to retrieve.
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering blogCategories.
   * @returns {Promise<{ result: CategoryEntity[]; total: number }>} - The list of categories and the total count.
   */
  @Get(':categoryId/blogCategory')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Optional page for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Optional limit for pagination',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Optional search for searching',
  })
  async getBlogCategoriesByCategoryId(
    @Param('categoryId') categoryId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: BlogCategoryEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.blogCategoryService.getBlogCategoriesByCategoryId(
      categoryId,
      skip,
      itemsPerPage,
      search,
    );
  }

  /**
   * Get all categories with pagination support.
   *
   *
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering categories.
   * @returns {Promise<{ result: CategoryEntity[]; total: number }>} - The list of categories and the total count.
   */
  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Optional page for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Optional limit for pagination',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Optional search for searching',
  })
  async getAllCategories(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: CategoryEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.categoryService.getAllCategories(skip, itemsPerPage, search);
  }

  /**
   * Get category data for dropdowns.
   *
   *
   * @param {string} fields - Comma-separated list of fields to retrieve (optional).
   * @param {string} keyword - The keyword for filtering data (optional).
   * @returns {Promise<CategoryEntity[]>} - The list of category data for dropdowns.
   */
  @Get('dropdown')
  @ApiQuery({
    name: 'fields',
    required: false,
    type: String,
    description: 'Optional fields for filtering',
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    type: String,
    description: 'Optional keyword for filtering',
  })
  async getCategoryDropdownData(
    @Query('fields') fields?: string,
    @Query('keyword') keyword?: string,
  ): Promise<CategoryEntity[]> {
    const fieldArray = fields ? fields.split(',') : ['id', 'name'];
    return this.categoryService.findAllDropdownData(fieldArray, keyword);
  }

  /**
   * Get a category by ID.
   *
   *
   * @param {number} id - The id of the category to retrieve.
   * @returns {Promise<CategoryEntity>} - The category object.
   */
  @Get(':id')
  async getCategoryById(@Param('id') id: number): Promise<CategoryEntity> {
    return this.categoryService.getCategoryById(id);
  }

  /**
   * Create a new category.
   *
   *
   * @param {CreateCategoryDto} createCategoryDto - The DTO for creating a category.
   * @returns {Promise<CategoryEntity>} - The newly created category object.
   */
  @Post()
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    return this.categoryService.createCategory(createCategoryDto);
  }

  /**
   * Update an existing category.
   *
   *
   * @param {number} id - The id of the category to update.
   * @param {UpdateCategoryDto} updateCategoryDto - The DTO for updating a category.
   * @returns {Promise<CategoryEntity>} - The updated category object.
   */
  @Put(':id')
  async updateCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  /**
   * Delete a category by ID.
   *
   *
   * @param {number} id - The id of the category to delete.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deleteCategory(@Param('id') id: number): Promise<void> {
    return this.categoryService.deleteCategory(id);
  }
}
