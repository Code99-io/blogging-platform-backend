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
import { BlogCategoryService } from './blog-category.service';
import { BlogCategoryEntity } from './blog-category.entity';
import { CreateBlogCategoryDto } from './create-blog-category.dto';
import { UpdateBlogCategoryDto } from './update-blog-category.dto';

@ApiBearerAuth('BearerAuth')
@ApiTags('BlogCategories')
@Controller('blogCategories')
export class BlogCategoryController {
  constructor(private blogCategoryService: BlogCategoryService) {}

  /**
   * Get all blogCategories with pagination support.
   *
   *
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering blogCategories.
   * @returns {Promise<{ result: BlogCategoryEntity[]; total: number }>} - The list of blogCategories and the total count.
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
  async getAllBlogCategories(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: BlogCategoryEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.blogCategoryService.getAllBlogCategories(
      skip,
      itemsPerPage,
      search,
    );
  }

  /**
   * Get blogCategory data for dropdowns.
   *
   *
   * @param {string} fields - Comma-separated list of fields to retrieve (optional).
   * @param {string} keyword - The keyword for filtering data (optional).
   * @returns {Promise<BlogCategoryEntity[]>} - The list of blogCategory data for dropdowns.
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
  async getBlogCategoryDropdownData(
    @Query('fields') fields?: string,
    @Query('keyword') keyword?: string,
  ): Promise<BlogCategoryEntity[]> {
    const fieldArray = fields ? fields.split(',') : ['id'];
    return this.blogCategoryService.findAllDropdownData(fieldArray, keyword);
  }

  /**
   * Get a blogCategory by ID.
   *
   *
   * @param {number} id - The id of the blogCategory to retrieve.
   * @returns {Promise<BlogCategoryEntity>} - The blogCategory object.
   */
  @Get(':id')
  async getBlogCategoryById(
    @Param('id') id: number,
  ): Promise<BlogCategoryEntity> {
    return this.blogCategoryService.getBlogCategoryById(id);
  }

  /**
   * Create a new blogCategory.
   *
   *
   * @param {CreateBlogCategoryDto} createBlogCategoryDto - The DTO for creating a blogCategory.
   * @returns {Promise<BlogCategoryEntity>} - The newly created blogCategory object.
   */
  @Post()
  async createBlogCategory(
    @Body() createBlogCategoryDto: CreateBlogCategoryDto,
  ): Promise<BlogCategoryEntity> {
    return this.blogCategoryService.createBlogCategory(createBlogCategoryDto);
  }

  /**
   * Update an existing blogCategory.
   *
   *
   * @param {number} id - The id of the blogCategory to update.
   * @param {UpdateBlogCategoryDto} updateBlogCategoryDto - The DTO for updating a blogCategory.
   * @returns {Promise<BlogCategoryEntity>} - The updated blogCategory object.
   */
  @Put(':id')
  async updateBlogCategory(
    @Param('id') id: number,
    @Body() updateBlogCategoryDto: UpdateBlogCategoryDto,
  ): Promise<BlogCategoryEntity> {
    return this.blogCategoryService.updateBlogCategory(
      id,
      updateBlogCategoryDto,
    );
  }

  /**
   * Delete a blogCategory by ID.
   *
   *
   * @param {number} id - The id of the blogCategory to delete.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deleteBlogCategory(@Param('id') id: number): Promise<void> {
    return this.blogCategoryService.deleteBlogCategory(id);
  }
}
