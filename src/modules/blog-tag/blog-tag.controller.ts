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
import { BlogTagService } from './blog-tag.service';
import { BlogTagEntity } from './blog-tag.entity';
import { CreateBlogTagDto } from './create-blog-tag.dto';
import { UpdateBlogTagDto } from './update-blog-tag.dto';

@ApiBearerAuth('BearerAuth')
@ApiTags('BlogTags')
@Controller('blogTags')
export class BlogTagController {
  constructor(private blogTagService: BlogTagService) {}

  /**
   * Get all blogTags with pagination support.
   *
   *
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering blogTags.
   * @returns {Promise<{ result: BlogTagEntity[]; total: number }>} - The list of blogTags and the total count.
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
  async getAllBlogTags(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: BlogTagEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.blogTagService.getAllBlogTags(skip, itemsPerPage, search);
  }

  /**
   * Get blogTag data for dropdowns.
   *
   *
   * @param {string} fields - Comma-separated list of fields to retrieve (optional).
   * @param {string} keyword - The keyword for filtering data (optional).
   * @returns {Promise<BlogTagEntity[]>} - The list of blogTag data for dropdowns.
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
  async getBlogTagDropdownData(
    @Query('fields') fields?: string,
    @Query('keyword') keyword?: string,
  ): Promise<BlogTagEntity[]> {
    const fieldArray = fields ? fields.split(',') : ['id'];
    return this.blogTagService.findAllDropdownData(fieldArray, keyword);
  }

  /**
   * Get a blogTag by ID.
   *
   *
   * @param {number} id - The id of the blogTag to retrieve.
   * @returns {Promise<BlogTagEntity>} - The blogTag object.
   */
  @Get(':id')
  async getBlogTagById(@Param('id') id: number): Promise<BlogTagEntity> {
    return this.blogTagService.getBlogTagById(id);
  }

  /**
   * Create a new blogTag.
   *
   *
   * @param {CreateBlogTagDto} createBlogTagDto - The DTO for creating a blogTag.
   * @returns {Promise<BlogTagEntity>} - The newly created blogTag object.
   */
  @Post()
  async createBlogTag(
    @Body() createBlogTagDto: CreateBlogTagDto,
  ): Promise<BlogTagEntity> {
    return this.blogTagService.createBlogTag(createBlogTagDto);
  }

  /**
   * Update an existing blogTag.
   *
   *
   * @param {number} id - The id of the blogTag to update.
   * @param {UpdateBlogTagDto} updateBlogTagDto - The DTO for updating a blogTag.
   * @returns {Promise<BlogTagEntity>} - The updated blogTag object.
   */
  @Put(':id')
  async updateBlogTag(
    @Param('id') id: number,
    @Body() updateBlogTagDto: UpdateBlogTagDto,
  ): Promise<BlogTagEntity> {
    return this.blogTagService.updateBlogTag(id, updateBlogTagDto);
  }

  /**
   * Delete a blogTag by ID.
   *
   *
   * @param {number} id - The id of the blogTag to delete.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deleteBlogTag(@Param('id') id: number): Promise<void> {
    return this.blogTagService.deleteBlogTag(id);
  }
}
