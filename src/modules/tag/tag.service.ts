import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { TagRepository } from './tag.repository';
import { TagEntity } from './tag.entity';
import { CreateTagDto } from './create-tag.dto';
import { UpdateTagDto } from './update-tag.dto';

@Injectable()
export class TagService {
  constructor(private tagRepository: TagRepository) {}

  /**
   * Retrieve a paginated list of tags.
   *
   *
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: TagEntity[]; total: number }>} - The list of tags and the total count.
   */
  async getAllTags(
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: TagEntity[]; total: number }> {
    try {
      return await this.tagRepository.getAll(skip, take, search);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Get a tag by ID.
   *
   *
   * @param {number} id - The id of the tag to retrieve.
   * @returns {Promise<TagEntity>} - The tag object.
   * @throws {NotFoundException} - If the tag with the given ID is not found.
   */
  async getTagById(id: number): Promise<TagEntity> {
    try {
      const tag = await this.tagRepository.findById(id);
      if (!tag) {
        throw new NotFoundException('TagEntity not found');
      }
      return tag;
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Create a new tag.
   *
   *
   * @param {CreateTagDto} createTagDto - The DTO for creating a tag.
   * @returns {Promise<TagEntity>} - The newly created tag object.
   */
  async createTag(createTagDto: CreateTagDto): Promise<TagEntity> {
    try {
      const tag = this.tagRepository.create({
        name: createTagDto.name,
      });
      return this.tagRepository.save(tag);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Update an existing tag.
   *
   *
   * @param {number} id - The id of the tag to update.
   * @param {UpdateTagDto} updateTagDto - The DTO for updating a tag.
   * @returns {Promise<TagEntity>} - The updated tag object.
   * @throws {NotFoundException} - If the tag with the given ID is not found.
   */
  async updateTag(id: number, updateTagDto: UpdateTagDto): Promise<TagEntity> {
    try {
      const tag = await this.getTagById(id);

      const updateData: DeepPartial<TagEntity> = {
        name: updateTagDto.name,
      };

      this.tagRepository.merge(tag, updateData);
      return this.tagRepository.save(tag);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Delete a tag by its ID.
   *
   *
   * @param {number} id - The id of the tag to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} - If the tag with the given ID is not found.
   */
  async deleteTag(id: number): Promise<void> {
    try {
      const tag = await this.getTagById(id);
      await this.tagRepository.remove(tag);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Find tag data for dropdowns with optional filtering.
   *
   *
   * @param {string[]} fields - Comma-separated list of fields to retrieve.
   * @param {string} keyword - Optional keyword for filtering data.
   * @returns {Promise<TagEntity[]>} - The list of tag data for dropdowns.
   */
  async findAllDropdownData(
    fields: string[],
    keyword?: string,
  ): Promise<TagEntity[]> {
    try {
      return this.tagRepository.findAllDropdown(fields, keyword);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }
}
