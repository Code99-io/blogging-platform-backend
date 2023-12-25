import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { BlogRepository } from './blog.repository';
import { BlogEntity } from './blog.entity';
import { CreateBlogDto } from './create-blog.dto';
import { UpdateBlogDto } from './update-blog.dto';

@Injectable()
export class BlogService {
  constructor(private blogRepository: BlogRepository) {}

  /**
   * Retrieve a paginated list of blogs for a specific user.
   *
   * @param {number} userId - The ID of the user whose blogs to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: BlogEntity[]; total: number }>} - The list of blogs and the total count.
   */
  async getAllBlogs(
    userId: number,
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: BlogEntity[]; total: number }> {
    try {
      return await this.blogRepository.getAll(userId, skip, take, search);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Get a blog by ID for a specific user.
   *
   * @param {number} userId - The ID of the user who owns the blog.
   * @param {number} id - The id of the blog to retrieve.
   * @returns {Promise<BlogEntity>} - The blog object.
   * @throws {NotFoundException} - If the blog with the given ID is not found.
   */
  async getBlogById(userId: number, id: number): Promise<BlogEntity> {
    try {
      const blog = await this.blogRepository.findById(userId, id);
      if (!blog) {
        throw new NotFoundException('BlogEntity not found');
      }
      return blog;
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Create a new blog for a specific user.
   *
   * @param {number} userId - The ID of the user creating the blog.
   * @param {CreateBlogDto} createBlogDto - The DTO for creating a blog.
   * @returns {Promise<BlogEntity>} - The newly created blog object.
   */
  async createBlog(
    userId: number,
    createBlogDto: CreateBlogDto,
  ): Promise<BlogEntity> {
    try {
      const blog = this.blogRepository.create({
        title: createBlogDto.title,
        content: createBlogDto.content,
        published: createBlogDto.published,
        author: { id: userId },
      });
      return this.blogRepository.save(blog);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Update an existing blog for a specific user.
   *
   * @param {number} userId - The ID of the user who owns the blog.
   * @param {number} id - The id of the blog to update.
   * @param {UpdateBlogDto} updateBlogDto - The DTO for updating a blog.
   * @returns {Promise<BlogEntity>} - The updated blog object.
   * @throws {NotFoundException} - If the blog with the given ID is not found.
   */
  async updateBlog(
    userId: number,
    id: number,
    updateBlogDto: UpdateBlogDto,
  ): Promise<BlogEntity> {
    try {
      const blog = await this.getBlogById(userId, id);

      const updateData: DeepPartial<BlogEntity> = {
        title: updateBlogDto.title,
        content: updateBlogDto.content,
        published: updateBlogDto.published,
        author: { id: userId },
      };

      this.blogRepository.merge(blog, updateData);
      return this.blogRepository.save(blog);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Delete a blog for a specific user by its ID.
   *
   * @param {number} userId - The ID of the user who owns the blog.
   * @param {number} id - The id of the blog to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} - If the blog with the given ID is not found.
   */
  async deleteBlog(userId: number, id: number): Promise<void> {
    try {
      const blog = await this.getBlogById(userId, id);
      await this.blogRepository.remove(blog);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Find blog data for dropdowns with optional filtering.
   *
   *@param {number} userId - The ID of the user whose data to retrieve.
   * @param {string[]} fields - Comma-separated list of fields to retrieve.
   * @param {string} keyword - Optional keyword for filtering data.
   * @returns {Promise<BlogEntity[]>} - The list of blog data for dropdowns.
   */
  async findAllDropdownData(
    userId: number,
    fields: string[],
    keyword?: string,
  ): Promise<BlogEntity[]> {
    try {
      return this.blogRepository.findAllDropdown(userId, fields, keyword);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }
}
