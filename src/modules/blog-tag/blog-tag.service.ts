import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { BlogTagRepository } from './blog-tag.repository';
import { BlogTagEntity } from './blog-tag.entity';
import { CreateBlogTagDto } from './create-blog-tag.dto';
import { UpdateBlogTagDto } from './update-blog-tag.dto';

@Injectable()
export class BlogTagService {
  constructor(private blogTagRepository: BlogTagRepository) {}

  /**
   * Retrieve a paginated list of blogTags.
   *
   *
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: BlogTagEntity[]; total: number }>} - The list of blogTags and the total count.
   */
  async getAllBlogTags(
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: BlogTagEntity[]; total: number }> {
    try {
      return await this.blogTagRepository.getAll(skip, take, search);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Get a blogTag by ID.
   *
   *
   * @param {number} id - The id of the blogTag to retrieve.
   * @returns {Promise<BlogTagEntity>} - The blogTag object.
   * @throws {NotFoundException} - If the blogTag with the given ID is not found.
   */
  async getBlogTagById(id: number): Promise<BlogTagEntity> {
    try {
      const blogTag = await this.blogTagRepository.findById(id);
      if (!blogTag) {
        throw new NotFoundException('BlogTagEntity not found');
      }
      return blogTag;
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Create a new blogTag.
   *
   *
   * @param {CreateBlogTagDto} createBlogTagDto - The DTO for creating a blogTag.
   * @returns {Promise<BlogTagEntity>} - The newly created blogTag object.
   */
  async createBlogTag(
    createBlogTagDto: CreateBlogTagDto,
  ): Promise<BlogTagEntity> {
    try {
      const blogTag = this.blogTagRepository.create({
        blog: { id: createBlogTagDto.blogId },
        tag: { id: createBlogTagDto.tagId },
      });
      return this.blogTagRepository.save(blogTag);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Update an existing blogTag.
   *
   *
   * @param {number} id - The id of the blogTag to update.
   * @param {UpdateBlogTagDto} updateBlogTagDto - The DTO for updating a blogTag.
   * @returns {Promise<BlogTagEntity>} - The updated blogTag object.
   * @throws {NotFoundException} - If the blogTag with the given ID is not found.
   */
  async updateBlogTag(
    id: number,
    updateBlogTagDto: UpdateBlogTagDto,
  ): Promise<BlogTagEntity> {
    try {
      const blogTag = await this.getBlogTagById(id);

      const updateData: DeepPartial<BlogTagEntity> = {
        blog: { id: updateBlogTagDto.blogId },
        tag: { id: updateBlogTagDto.tagId },
      };

      this.blogTagRepository.merge(blogTag, updateData);
      return this.blogTagRepository.save(blogTag);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Delete a blogTag by its ID.
   *
   *
   * @param {number} id - The id of the blogTag to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} - If the blogTag with the given ID is not found.
   */
  async deleteBlogTag(id: number): Promise<void> {
    try {
      const blogTag = await this.getBlogTagById(id);
      await this.blogTagRepository.remove(blogTag);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Find blogTag data for dropdowns with optional filtering.
   *
   *
   * @param {string[]} fields - Comma-separated list of fields to retrieve.
   * @param {string} keyword - Optional keyword for filtering data.
   * @returns {Promise<BlogTagEntity[]>} - The list of blogTag data for dropdowns.
   */
  async findAllDropdownData(
    fields: string[],
    keyword?: string,
  ): Promise<BlogTagEntity[]> {
    try {
      return this.blogTagRepository.findAllDropdown(fields, keyword);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Retrieve a paginated list of blogTags by blog.
   *
   *
   * @param {number} blogId - The blogId of the blogTag to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: BlogTagEntity[]; total: number }>} - The list of blogTags and the total count.
   */
  async getBlogTagsByBlogId(
    blogId: number,
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: BlogTagEntity[]; total: number }> {
    try {
      return await this.blogTagRepository.getBlogTagsByBlogId(
        blogId,
        skip,
        take,
        search,
      );
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Retrieve a paginated list of blogTags by tag.
   *
   *
   * @param {number} tagId - The tagId of the blogTag to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: BlogTagEntity[]; total: number }>} - The list of blogTags and the total count.
   */
  async getBlogTagsByTagId(
    tagId: number,
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: BlogTagEntity[]; total: number }> {
    try {
      return await this.blogTagRepository.getBlogTagsByTagId(
        tagId,
        skip,
        take,
        search,
      );
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }
}
