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
import { BlogService } from './blog.service';
import { BlogCategoryService } from 'src/modules/blog-category/blog-category.service';
import { BlogTagService } from 'src/modules/blog-tag/blog-tag.service';
import { DraftService } from 'src/modules/draft/draft.service';
import { CommentService } from 'src/modules/comment/comment.service';
import { LikeService } from 'src/modules/like/like.service';
import { BlogEntity } from './blog.entity';
import { BlogCategoryEntity } from 'src/modules/blog-category/blog-category.entity';
import { BlogTagEntity } from 'src/modules/blog-tag/blog-tag.entity';
import { DraftEntity } from 'src/modules/draft/draft.entity';
import { CommentEntity } from 'src/modules/comment/comment.entity';
import { LikeEntity } from 'src/modules/like/like.entity';
import { CreateBlogDto } from './create-blog.dto';
import { UpdateBlogDto } from './update-blog.dto';

@ApiBearerAuth('BearerAuth')
@ApiTags('Blogs')
@Controller('blogs')
export class BlogController {
  constructor(
    private blogService: BlogService,
    private blogCategoryService: BlogCategoryService,
    private blogTagService: BlogTagService,
    private draftService: DraftService,
    private commentService: CommentService,
    private likeService: LikeService,
  ) {}

  /**
   * Get all blogCategories by blogs with pagination support.
   *
   *
   * @param {number} blogId - The blogId of the blogCategory to retrieve.
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering blogCategories.
   * @returns {Promise<{ result: BlogEntity[]; total: number }>} - The list of blogs and the total count.
   */
  @Get(':blogId/blogCategory')
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
  async getBlogCategoriesByBlogId(
    @Param('blogId') blogId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: BlogCategoryEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.blogCategoryService.getBlogCategoriesByBlogId(
      blogId,
      skip,
      itemsPerPage,
      search,
    );
  }

  /**
   * Get all blogTags by blogs with pagination support.
   *
   *
   * @param {number} blogId - The blogId of the blogTag to retrieve.
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering blogTags.
   * @returns {Promise<{ result: BlogEntity[]; total: number }>} - The list of blogs and the total count.
   */
  @Get(':blogId/blogTag')
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
  async getBlogTagsByBlogId(
    @Param('blogId') blogId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: BlogTagEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.blogTagService.getBlogTagsByBlogId(
      blogId,
      skip,
      itemsPerPage,
      search,
    );
  }

  /**
   * Get all drafts by blogs with pagination support.
   *
   * @param {Request} req - The Express request object.
   * @param {number} blogId - The blogId of the draft to retrieve.
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering drafts.
   * @returns {Promise<{ result: BlogEntity[]; total: number }>} - The list of blogs and the total count.
   */
  @Get(':blogId/draft')
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
  async getDraftsByBlogId(
    @Req() req,
    @Param('blogId') blogId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: DraftEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.draftService.getDraftsByBlogId(
      req.user.userId,
      blogId,
      skip,
      itemsPerPage,
      search,
    );
  }

  /**
   * Get all comments by blogs with pagination support.
   *
   * @param {Request} req - The Express request object.
   * @param {number} blogId - The blogId of the comment to retrieve.
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering comments.
   * @returns {Promise<{ result: BlogEntity[]; total: number }>} - The list of blogs and the total count.
   */
  @Get(':blogId/comment')
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
  async getCommentsByBlogId(
    @Req() req,
    @Param('blogId') blogId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: CommentEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.commentService.getCommentsByBlogId(
      req.user.userId,
      blogId,
      skip,
      itemsPerPage,
      search,
    );
  }

  /**
   * Get all likes by blogs with pagination support.
   *
   * @param {Request} req - The Express request object.
   * @param {number} blogId - The blogId of the like to retrieve.
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering likes.
   * @returns {Promise<{ result: BlogEntity[]; total: number }>} - The list of blogs and the total count.
   */
  @Get(':blogId/like')
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
  async getLikesByBlogId(
    @Req() req,
    @Param('blogId') blogId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: LikeEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.likeService.getLikesByBlogId(
      req.user.userId,
      blogId,
      skip,
      itemsPerPage,
      search,
    );
  }

  /**
   * Get all blogs with pagination support.
   *
   * @param {Request} req - The Express request object.
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering blogs.
   * @returns {Promise<{ result: BlogEntity[]; total: number }>} - The list of blogs and the total count.
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
  async getAllBlogs(
    @Req() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: BlogEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.blogService.getAllBlogs(
      req.user.userId,
      skip,
      itemsPerPage,
      search,
    );
  }

  /**
   * Get blog data for dropdowns.
   *
   * @param {Request} req - The Express request object.
   * @param {string} fields - Comma-separated list of fields to retrieve (optional).
   * @param {string} keyword - The keyword for filtering data (optional).
   * @returns {Promise<BlogEntity[]>} - The list of blog data for dropdowns.
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
  async getBlogDropdownData(
    @Req() req,
    @Query('fields') fields?: string,
    @Query('keyword') keyword?: string,
  ): Promise<BlogEntity[]> {
    const fieldArray = fields ? fields.split(',') : ['id', 'title'];
    return this.blogService.findAllDropdownData(
      req.user.userId,
      fieldArray,
      keyword,
    );
  }

  /**
   * Get a blog by ID.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the blog to retrieve.
   * @returns {Promise<BlogEntity>} - The blog object.
   */
  @Get(':id')
  async getBlogById(@Req() req, @Param('id') id: number): Promise<BlogEntity> {
    return this.blogService.getBlogById(req.user.userId, id);
  }

  /**
   * Create a new blog.
   *
   * @param {Request} req - The Express request object.
   * @param {CreateBlogDto} createBlogDto - The DTO for creating a blog.
   * @returns {Promise<BlogEntity>} - The newly created blog object.
   */
  @Post()
  async createBlog(
    @Req() req,
    @Body() createBlogDto: CreateBlogDto,
  ): Promise<BlogEntity> {
    return this.blogService.createBlog(req.user.userId, createBlogDto);
  }

  /**
   * Update an existing blog.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the blog to update.
   * @param {UpdateBlogDto} updateBlogDto - The DTO for updating a blog.
   * @returns {Promise<BlogEntity>} - The updated blog object.
   */
  @Put(':id')
  async updateBlog(
    @Req() req,
    @Param('id') id: number,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<BlogEntity> {
    return this.blogService.updateBlog(req.user.userId, id, updateBlogDto);
  }

  /**
   * Delete a blog by ID.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the blog to delete.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deleteBlog(@Req() req, @Param('id') id: number): Promise<void> {
    return this.blogService.deleteBlog(req.user.userId, id);
  }
}
