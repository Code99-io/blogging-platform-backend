import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { CategoryRepository } from './category.repository';
import { CategoryEntity } from './category.entity';
import { CreateCategoryDto } from './create-category.dto';
import { UpdateCategoryDto } from './update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  /**
   * Retrieve a paginated list of categories.
   *
   *
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: CategoryEntity[]; total: number }>} - The list of categories and the total count.
   */
  async getAllCategories(
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: CategoryEntity[]; total: number }> {
    try {
      return await this.categoryRepository.getAll(skip, take, search);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Get a category by ID.
   *
   *
   * @param {number} id - The id of the category to retrieve.
   * @returns {Promise<CategoryEntity>} - The category object.
   * @throws {NotFoundException} - If the category with the given ID is not found.
   */
  async getCategoryById(id: number): Promise<CategoryEntity> {
    try {
      const category = await this.categoryRepository.findById(id);
      if (!category) {
        throw new NotFoundException('CategoryEntity not found');
      }
      return category;
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Create a new category.
   *
   *
   * @param {CreateCategoryDto} createCategoryDto - The DTO for creating a category.
   * @returns {Promise<CategoryEntity>} - The newly created category object.
   */
  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    try {
      const category = this.categoryRepository.create({
        name: createCategoryDto.name,
      });
      return this.categoryRepository.save(category);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Update an existing category.
   *
   *
   * @param {number} id - The id of the category to update.
   * @param {UpdateCategoryDto} updateCategoryDto - The DTO for updating a category.
   * @returns {Promise<CategoryEntity>} - The updated category object.
   * @throws {NotFoundException} - If the category with the given ID is not found.
   */
  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    try {
      const category = await this.getCategoryById(id);

      const updateData: DeepPartial<CategoryEntity> = {
        name: updateCategoryDto.name,
      };

      this.categoryRepository.merge(category, updateData);
      return this.categoryRepository.save(category);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Delete a category by its ID.
   *
   *
   * @param {number} id - The id of the category to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} - If the category with the given ID is not found.
   */
  async deleteCategory(id: number): Promise<void> {
    try {
      const category = await this.getCategoryById(id);
      await this.categoryRepository.remove(category);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Find category data for dropdowns with optional filtering.
   *
   *
   * @param {string[]} fields - Comma-separated list of fields to retrieve.
   * @param {string} keyword - Optional keyword for filtering data.
   * @returns {Promise<CategoryEntity[]>} - The list of category data for dropdowns.
   */
  async findAllDropdownData(
    fields: string[],
    keyword?: string,
  ): Promise<CategoryEntity[]> {
    try {
      return this.categoryRepository.findAllDropdown(fields, keyword);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }
}
