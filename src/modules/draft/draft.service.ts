import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { DraftRepository } from './draft.repository';
import { DraftEntity } from './draft.entity';
import { CreateDraftDto } from './create-draft.dto';
import { UpdateDraftDto } from './update-draft.dto';

@Injectable()
export class DraftService {
  constructor(private draftRepository: DraftRepository) {}

  /**
   * Retrieve a paginated list of drafts for a specific user.
   *
   * @param {number} userId - The ID of the user whose drafts to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: DraftEntity[]; total: number }>} - The list of drafts and the total count.
   */
  async getAllDrafts(
    userId: number,
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: DraftEntity[]; total: number }> {
    try {
      return await this.draftRepository.getAll(userId, skip, take, search);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Get a draft by ID for a specific user.
   *
   * @param {number} userId - The ID of the user who owns the draft.
   * @param {number} id - The id of the draft to retrieve.
   * @returns {Promise<DraftEntity>} - The draft object.
   * @throws {NotFoundException} - If the draft with the given ID is not found.
   */
  async getDraftById(userId: number, id: number): Promise<DraftEntity> {
    try {
      const draft = await this.draftRepository.findById(userId, id);
      if (!draft) {
        throw new NotFoundException('DraftEntity not found');
      }
      return draft;
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Create a new draft for a specific user.
   *
   * @param {number} userId - The ID of the user creating the draft.
   * @param {CreateDraftDto} createDraftDto - The DTO for creating a draft.
   * @returns {Promise<DraftEntity>} - The newly created draft object.
   */
  async createDraft(
    userId: number,
    createDraftDto: CreateDraftDto,
  ): Promise<DraftEntity> {
    try {
      const draft = this.draftRepository.create({
        content: createDraftDto.content,
        blog: { id: createDraftDto.blogId },
        createdBy: { id: userId },
      });
      return this.draftRepository.save(draft);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Update an existing draft for a specific user.
   *
   * @param {number} userId - The ID of the user who owns the draft.
   * @param {number} id - The id of the draft to update.
   * @param {UpdateDraftDto} updateDraftDto - The DTO for updating a draft.
   * @returns {Promise<DraftEntity>} - The updated draft object.
   * @throws {NotFoundException} - If the draft with the given ID is not found.
   */
  async updateDraft(
    userId: number,
    id: number,
    updateDraftDto: UpdateDraftDto,
  ): Promise<DraftEntity> {
    try {
      const draft = await this.getDraftById(userId, id);

      const updateData: DeepPartial<DraftEntity> = {
        content: updateDraftDto.content,
        blog: { id: updateDraftDto.blogId },
        createdBy: { id: userId },
      };

      this.draftRepository.merge(draft, updateData);
      return this.draftRepository.save(draft);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Delete a draft for a specific user by its ID.
   *
   * @param {number} userId - The ID of the user who owns the draft.
   * @param {number} id - The id of the draft to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} - If the draft with the given ID is not found.
   */
  async deleteDraft(userId: number, id: number): Promise<void> {
    try {
      const draft = await this.getDraftById(userId, id);
      await this.draftRepository.remove(draft);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Find draft data for dropdowns with optional filtering.
   *
   *@param {number} userId - The ID of the user whose data to retrieve.
   * @param {string[]} fields - Comma-separated list of fields to retrieve.
   * @param {string} keyword - Optional keyword for filtering data.
   * @returns {Promise<DraftEntity[]>} - The list of draft data for dropdowns.
   */
  async findAllDropdownData(
    userId: number,
    fields: string[],
    keyword?: string,
  ): Promise<DraftEntity[]> {
    try {
      return this.draftRepository.findAllDropdown(userId, fields, keyword);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Retrieve a paginated list of drafts by blog for a specific user.
   *
   * @param {number} userId - The ID of the user whose drafts to retrieve.
   * @param {number} blogId - The blogId of the draft to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: DraftEntity[]; total: number }>} - The list of drafts and the total count.
   */
  async getDraftsByBlogId(
    userId: number,
    blogId: number,
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: DraftEntity[]; total: number }> {
    try {
      return await this.draftRepository.getDraftsByBlogId(
        userId,
        blogId,
        skip,
        take,
        search,
      );
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }
}
