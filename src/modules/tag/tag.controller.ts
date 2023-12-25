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
import { TagService } from './tag.service';
import { BlogTagService } from 'src/modules/blog-tag/blog-tag.service';
import { TagEntity } from './tag.entity';
import { BlogTagEntity } from 'src/modules/blog-tag/blog-tag.entity';
import { CreateTagDto } from './create-tag.dto';
import { UpdateTagDto } from './update-tag.dto';

@ApiBearerAuth('BearerAuth')
@ApiTags('Tags')
@Controller('tags')
export class TagController {
  constructor(
    private tagService: TagService,
    private blogTagService: BlogTagService,
  ) {}

  /**
   * Get all blogTags by tags with pagination support.
   *
   *
   * @param {number} tagId - The tagId of the blogTag to retrieve.
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering blogTags.
   * @returns {Promise<{ result: TagEntity[]; total: number }>} - The list of tags and the total count.
   */
  @Get(':tagId/blogTag')
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
  async getBlogTagsByTagId(
    @Param('tagId') tagId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: BlogTagEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.blogTagService.getBlogTagsByTagId(
      tagId,
      skip,
      itemsPerPage,
      search,
    );
  }

  /**
   * Get all tags with pagination support.
   *
   *
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering tags.
   * @returns {Promise<{ result: TagEntity[]; total: number }>} - The list of tags and the total count.
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
  async getAllTags(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: TagEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.tagService.getAllTags(skip, itemsPerPage, search);
  }

  /**
   * Get tag data for dropdowns.
   *
   *
   * @param {string} fields - Comma-separated list of fields to retrieve (optional).
   * @param {string} keyword - The keyword for filtering data (optional).
   * @returns {Promise<TagEntity[]>} - The list of tag data for dropdowns.
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
  async getTagDropdownData(
    @Query('fields') fields?: string,
    @Query('keyword') keyword?: string,
  ): Promise<TagEntity[]> {
    const fieldArray = fields ? fields.split(',') : ['id', 'name'];
    return this.tagService.findAllDropdownData(fieldArray, keyword);
  }

  /**
   * Get a tag by ID.
   *
   *
   * @param {number} id - The id of the tag to retrieve.
   * @returns {Promise<TagEntity>} - The tag object.
   */
  @Get(':id')
  async getTagById(@Param('id') id: number): Promise<TagEntity> {
    return this.tagService.getTagById(id);
  }

  /**
   * Create a new tag.
   *
   *
   * @param {CreateTagDto} createTagDto - The DTO for creating a tag.
   * @returns {Promise<TagEntity>} - The newly created tag object.
   */
  @Post()
  async createTag(@Body() createTagDto: CreateTagDto): Promise<TagEntity> {
    return this.tagService.createTag(createTagDto);
  }

  /**
   * Update an existing tag.
   *
   *
   * @param {number} id - The id of the tag to update.
   * @param {UpdateTagDto} updateTagDto - The DTO for updating a tag.
   * @returns {Promise<TagEntity>} - The updated tag object.
   */
  @Put(':id')
  async updateTag(
    @Param('id') id: number,
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<TagEntity> {
    return this.tagService.updateTag(id, updateTagDto);
  }

  /**
   * Delete a tag by ID.
   *
   *
   * @param {number} id - The id of the tag to delete.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deleteTag(@Param('id') id: number): Promise<void> {
    return this.tagService.deleteTag(id);
  }
}
