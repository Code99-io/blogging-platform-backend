import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { LikeRepository } from './like.repository';
import { LikeEntity } from './like.entity';
import { CreateLikeDto } from './create-like.dto';
import { UpdateLikeDto } from './update-like.dto';

@Injectable()
export class LikeService {
  constructor(private likeRepository: LikeRepository) {}

  /**
   * Retrieve a paginated list of likes for a specific user.
   *
   * @param {number} userId - The ID of the user whose likes to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: LikeEntity[]; total: number }>} - The list of likes and the total count.
   */
  async getAllLikes(
    userId: number,
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: LikeEntity[]; total: number }> {
    try {
      return await this.likeRepository.getAll(userId, skip, take, search);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Get a like by ID for a specific user.
   *
   * @param {number} userId - The ID of the user who owns the like.
   * @param {number} id - The id of the like to retrieve.
   * @returns {Promise<LikeEntity>} - The like object.
   * @throws {NotFoundException} - If the like with the given ID is not found.
   */
  async getLikeById(userId: number, id: number): Promise<LikeEntity> {
    try {
      const like = await this.likeRepository.findById(userId, id);
      if (!like) {
        throw new NotFoundException('LikeEntity not found');
      }
      return like;
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Create a new like for a specific user.
   *
   * @param {number} userId - The ID of the user creating the like.
   * @param {CreateLikeDto} createLikeDto - The DTO for creating a like.
   * @returns {Promise<LikeEntity>} - The newly created like object.
   */
  async createLike(
    userId: number,
    createLikeDto: CreateLikeDto,
  ): Promise<LikeEntity> {
    try {
      const like = this.likeRepository.create({
        blog: { id: createLikeDto.blogId },
        user: { id: userId },
      });
      return this.likeRepository.save(like);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Update an existing like for a specific user.
   *
   * @param {number} userId - The ID of the user who owns the like.
   * @param {number} id - The id of the like to update.
   * @param {UpdateLikeDto} updateLikeDto - The DTO for updating a like.
   * @returns {Promise<LikeEntity>} - The updated like object.
   * @throws {NotFoundException} - If the like with the given ID is not found.
   */
  async updateLike(
    userId: number,
    id: number,
    updateLikeDto: UpdateLikeDto,
  ): Promise<LikeEntity> {
    try {
      const like = await this.getLikeById(userId, id);

      const updateData: DeepPartial<LikeEntity> = {
        blog: { id: updateLikeDto.blogId },
        user: { id: userId },
      };

      this.likeRepository.merge(like, updateData);
      return this.likeRepository.save(like);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Delete a like for a specific user by its ID.
   *
   * @param {number} userId - The ID of the user who owns the like.
   * @param {number} id - The id of the like to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} - If the like with the given ID is not found.
   */
  async deleteLike(userId: number, id: number): Promise<void> {
    try {
      const like = await this.getLikeById(userId, id);
      await this.likeRepository.remove(like);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Find like data for dropdowns with optional filtering.
   *
   *@param {number} userId - The ID of the user whose data to retrieve.
   * @param {string[]} fields - Comma-separated list of fields to retrieve.
   * @param {string} keyword - Optional keyword for filtering data.
   * @returns {Promise<LikeEntity[]>} - The list of like data for dropdowns.
   */
  async findAllDropdownData(
    userId: number,
    fields: string[],
    keyword?: string,
  ): Promise<LikeEntity[]> {
    try {
      return this.likeRepository.findAllDropdown(userId, fields, keyword);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Retrieve a paginated list of likes by blog for a specific user.
   *
   * @param {number} userId - The ID of the user whose likes to retrieve.
   * @param {number} blogId - The blogId of the like to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: LikeEntity[]; total: number }>} - The list of likes and the total count.
   */
  async getLikesByBlogId(
    userId: number,
    blogId: number,
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: LikeEntity[]; total: number }> {
    try {
      return await this.likeRepository.getLikesByBlogId(
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
