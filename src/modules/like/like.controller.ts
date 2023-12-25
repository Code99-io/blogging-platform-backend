import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { LikeService } from './like.service';
import { LikeEntity } from './like.entity';
import { CreateLikeDto } from './create-like.dto';
import { UpdateLikeDto } from './update-like.dto';

@ApiBearerAuth('BearerAuth')
@ApiTags('Likes')
@Controller('likes')
export class LikeController {
  constructor(private likeService: LikeService) {}

  /**
   * Get all likes with pagination support.
   *
   * @param {Request} req - The Express request object.
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering likes.
   * @returns {Promise<{ result: LikeEntity[]; total: number }>} - The list of likes and the total count.
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
  async getAllLikes(
    @Req() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: LikeEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.likeService.getAllLikes(
      req.user.userId,
      skip,
      itemsPerPage,
      search,
    );
  }

  /**
   * Get like data for dropdowns.
   *
   * @param {Request} req - The Express request object.
   * @param {string} fields - Comma-separated list of fields to retrieve (optional).
   * @param {string} keyword - The keyword for filtering data (optional).
   * @returns {Promise<LikeEntity[]>} - The list of like data for dropdowns.
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
  async getLikeDropdownData(
    @Req() req,
    @Query('fields') fields?: string,
    @Query('keyword') keyword?: string,
  ): Promise<LikeEntity[]> {
    const fieldArray = fields ? fields.split(',') : ['id'];
    return this.likeService.findAllDropdownData(
      req.user.userId,
      fieldArray,
      keyword,
    );
  }

  /**
   * Get a like by ID.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the like to retrieve.
   * @returns {Promise<LikeEntity>} - The like object.
   */
  @Get(':id')
  async getLikeById(@Req() req, @Param('id') id: number): Promise<LikeEntity> {
    return this.likeService.getLikeById(req.user.userId, id);
  }

  /**
   * Create a new like.
   *
   * @param {Request} req - The Express request object.
   * @param {CreateLikeDto} createLikeDto - The DTO for creating a like.
   * @returns {Promise<LikeEntity>} - The newly created like object.
   */
  @Post()
  async createLike(
    @Req() req,
    @Body() createLikeDto: CreateLikeDto,
  ): Promise<LikeEntity> {
    return this.likeService.createLike(req.user.userId, createLikeDto);
  }

  /**
   * Update an existing like.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the like to update.
   * @param {UpdateLikeDto} updateLikeDto - The DTO for updating a like.
   * @returns {Promise<LikeEntity>} - The updated like object.
   */
  @Put(':id')
  async updateLike(
    @Req() req,
    @Param('id') id: number,
    @Body() updateLikeDto: UpdateLikeDto,
  ): Promise<LikeEntity> {
    return this.likeService.updateLike(req.user.userId, id, updateLikeDto);
  }

  /**
   * Delete a like by ID.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the like to delete.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deleteLike(@Req() req, @Param('id') id: number): Promise<void> {
    return this.likeService.deleteLike(req.user.userId, id);
  }
}
