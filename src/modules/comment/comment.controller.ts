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
import { CommentService } from './comment.service';
import { CommentEntity } from './comment.entity';
import { CreateCommentDto } from './create-comment.dto';
import { UpdateCommentDto } from './update-comment.dto';

@ApiBearerAuth('BearerAuth')
@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  /**
   * Get all comments with pagination support.
   *
   * @param {Request} req - The Express request object.
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering comments.
   * @returns {Promise<{ result: CommentEntity[]; total: number }>} - The list of comments and the total count.
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
  async getAllComments(
    @Req() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: CommentEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.commentService.getAllComments(
      req.user.userId,
      skip,
      itemsPerPage,
      search,
    );
  }

  /**
   * Get comment data for dropdowns.
   *
   * @param {Request} req - The Express request object.
   * @param {string} fields - Comma-separated list of fields to retrieve (optional).
   * @param {string} keyword - The keyword for filtering data (optional).
   * @returns {Promise<CommentEntity[]>} - The list of comment data for dropdowns.
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
  async getCommentDropdownData(
    @Req() req,
    @Query('fields') fields?: string,
    @Query('keyword') keyword?: string,
  ): Promise<CommentEntity[]> {
    const fieldArray = fields ? fields.split(',') : ['id'];
    return this.commentService.findAllDropdownData(
      req.user.userId,
      fieldArray,
      keyword,
    );
  }

  /**
   * Get a comment by ID.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the comment to retrieve.
   * @returns {Promise<CommentEntity>} - The comment object.
   */
  @Get(':id')
  async getCommentById(
    @Req() req,
    @Param('id') id: number,
  ): Promise<CommentEntity> {
    return this.commentService.getCommentById(req.user.userId, id);
  }

  /**
   * Create a new comment.
   *
   * @param {Request} req - The Express request object.
   * @param {CreateCommentDto} createCommentDto - The DTO for creating a comment.
   * @returns {Promise<CommentEntity>} - The newly created comment object.
   */
  @Post()
  async createComment(
    @Req() req,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentEntity> {
    return this.commentService.createComment(req.user.userId, createCommentDto);
  }

  /**
   * Update an existing comment.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the comment to update.
   * @param {UpdateCommentDto} updateCommentDto - The DTO for updating a comment.
   * @returns {Promise<CommentEntity>} - The updated comment object.
   */
  @Put(':id')
  async updateComment(
    @Req() req,
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<CommentEntity> {
    return this.commentService.updateComment(
      req.user.userId,
      id,
      updateCommentDto,
    );
  }

  /**
   * Delete a comment by ID.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the comment to delete.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deleteComment(@Req() req, @Param('id') id: number): Promise<void> {
    return this.commentService.deleteComment(req.user.userId, id);
  }
}
