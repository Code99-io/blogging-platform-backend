import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { BlogCategoryRepository } from './blog-category.repository';
import { BlogCategoryEntity } from './blog-category.entity';
import { CreateBlogCategoryDto } from './create-blog-category.dto';
import { UpdateBlogCategoryDto } from './update-blog-category.dto';

@Injectable()
export class BlogCategoryService {
  constructor(private blogCategoryRepository: BlogCategoryRepository) {}

  /**
   * Retrieve a paginated list of blogCategories.
   *
   *
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: BlogCategoryEntity[]; total: number }>} - The list of blogCategories and the total count.
   */
  async getAllBlogCategories(
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: BlogCategoryEntity[]; total: number }> {
    try {
      return await this.blogCategoryRepository.getAll(skip, take, search);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Get a blogCategory by ID.
   *
   *
   * @param {number} id - The id of the blogCategory to retrieve.
   * @returns {Promise<BlogCategoryEntity>} - The blogCategory object.
   * @throws {NotFoundException} - If the blogCategory with the given ID is not found.
   */
  async getBlogCategoryById(id: number): Promise<BlogCategoryEntity> {
    try {
      const blogCategory = await this.blogCategoryRepository.findById(id);
      if (!blogCategory) {
        throw new NotFoundException('BlogCategoryEntity not found');
      }
      return blogCategory;
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Create a new blogCategory.
   *
   *
   * @param {CreateBlogCategoryDto} createBlogCategoryDto - The DTO for creating a blogCategory.
   * @returns {Promise<BlogCategoryEntity>} - The newly created blogCategory object.
   */
  async createBlogCategory(
    createBlogCategoryDto: CreateBlogCategoryDto,
  ): Promise<BlogCategoryEntity> {
    try {
      const blogCategory = this.blogCategoryRepository.create({
        blog: { id: createBlogCategoryDto.blogId },
        category: { id: createBlogCategoryDto.categoryId },
      });
      return this.blogCategoryRepository.save(blogCategory);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Update an existing blogCategory.
   *
   *
   * @param {number} id - The id of the blogCategory to update.
   * @param {UpdateBlogCategoryDto} updateBlogCategoryDto - The DTO for updating a blogCategory.
   * @returns {Promise<BlogCategoryEntity>} - The updated blogCategory object.
   * @throws {NotFoundException} - If the blogCategory with the given ID is not found.
   */
  async updateBlogCategory(
    id: number,
    updateBlogCategoryDto: UpdateBlogCategoryDto,
  ): Promise<BlogCategoryEntity> {
    try {
      const blogCategory = await this.getBlogCategoryById(id);

      const updateData: DeepPartial<BlogCategoryEntity> = {
        blog: { id: updateBlogCategoryDto.blogId },
        category: { id: updateBlogCategoryDto.categoryId },
      };

      this.blogCategoryRepository.merge(blogCategory, updateData);
      return this.blogCategoryRepository.save(blogCategory);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Delete a blogCategory by its ID.
   *
   *
   * @param {number} id - The id of the blogCategory to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} - If the blogCategory with the given ID is not found.
   */
  async deleteBlogCategory(id: number): Promise<void> {
    try {
      const blogCategory = await this.getBlogCategoryById(id);
      await this.blogCategoryRepository.remove(blogCategory);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Find blogCategory data for dropdowns with optional filtering.
   *
   *
   * @param {string[]} fields - Comma-separated list of fields to retrieve.
   * @param {string} keyword - Optional keyword for filtering data.
   * @returns {Promise<BlogCategoryEntity[]>} - The list of blogCategory data for dropdowns.
   */
  async findAllDropdownData(
    fields: string[],
    keyword?: string,
  ): Promise<BlogCategoryEntity[]> {
    try {
      return this.blogCategoryRepository.findAllDropdown(fields, keyword);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Retrieve a paginated list of blogCategories by blog.
   *
   *
   * @param {number} blogId - The blogId of the blogCategory to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: BlogCategoryEntity[]; total: number }>} - The list of blogCategories and the total count.
   */
  async getBlogCategoriesByBlogId(
    blogId: number,
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: BlogCategoryEntity[]; total: number }> {
    try {
      return await this.blogCategoryRepository.getBlogCategoriesByBlogId(
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
   * Retrieve a paginated list of blogCategories by category.
   *
   *
   * @param {number} categoryId - The categoryId of the blogCategory to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: BlogCategoryEntity[]; total: number }>} - The list of blogCategories and the total count.
   */
  async getBlogCategoriesByCategoryId(
    categoryId: number,
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: BlogCategoryEntity[]; total: number }> {
    try {
      return await this.blogCategoryRepository.getBlogCategoriesByCategoryId(
        categoryId,
        skip,
        take,
        search,
      );
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }
}
