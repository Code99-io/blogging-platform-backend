import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { CommentRepository } from './comment.repository';
import { CommentEntity } from './comment.entity';
import { CreateCommentDto } from './create-comment.dto';
import { UpdateCommentDto } from './update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private commentRepository: CommentRepository) {}

  /**
   * Retrieve a paginated list of comments for a specific user.
   *
   * @param {number} userId - The ID of the user whose comments to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: CommentEntity[]; total: number }>} - The list of comments and the total count.
   */
  async getAllComments(
    userId: number,
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: CommentEntity[]; total: number }> {
    try {
      return await this.commentRepository.getAll(userId, skip, take, search);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Get a comment by ID for a specific user.
   *
   * @param {number} userId - The ID of the user who owns the comment.
   * @param {number} id - The id of the comment to retrieve.
   * @returns {Promise<CommentEntity>} - The comment object.
   * @throws {NotFoundException} - If the comment with the given ID is not found.
   */
  async getCommentById(userId: number, id: number): Promise<CommentEntity> {
    try {
      const comment = await this.commentRepository.findById(userId, id);
      if (!comment) {
        throw new NotFoundException('CommentEntity not found');
      }
      return comment;
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Create a new comment for a specific user.
   *
   * @param {number} userId - The ID of the user creating the comment.
   * @param {CreateCommentDto} createCommentDto - The DTO for creating a comment.
   * @returns {Promise<CommentEntity>} - The newly created comment object.
   */
  async createComment(
    userId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentEntity> {
    try {
      const comment = this.commentRepository.create({
        content: createCommentDto.content,
        blog: { id: createCommentDto.blogId },
        user: { id: userId },
      });
      return this.commentRepository.save(comment);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Update an existing comment for a specific user.
   *
   * @param {number} userId - The ID of the user who owns the comment.
   * @param {number} id - The id of the comment to update.
   * @param {UpdateCommentDto} updateCommentDto - The DTO for updating a comment.
   * @returns {Promise<CommentEntity>} - The updated comment object.
   * @throws {NotFoundException} - If the comment with the given ID is not found.
   */
  async updateComment(
    userId: number,
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<CommentEntity> {
    try {
      const comment = await this.getCommentById(userId, id);

      const updateData: DeepPartial<CommentEntity> = {
        content: updateCommentDto.content,
        blog: { id: updateCommentDto.blogId },
        user: { id: userId },
      };

      this.commentRepository.merge(comment, updateData);
      return this.commentRepository.save(comment);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Delete a comment for a specific user by its ID.
   *
   * @param {number} userId - The ID of the user who owns the comment.
   * @param {number} id - The id of the comment to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} - If the comment with the given ID is not found.
   */
  async deleteComment(userId: number, id: number): Promise<void> {
    try {
      const comment = await this.getCommentById(userId, id);
      await this.commentRepository.remove(comment);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Find comment data for dropdowns with optional filtering.
   *
   *@param {number} userId - The ID of the user whose data to retrieve.
   * @param {string[]} fields - Comma-separated list of fields to retrieve.
   * @param {string} keyword - Optional keyword for filtering data.
   * @returns {Promise<CommentEntity[]>} - The list of comment data for dropdowns.
   */
  async findAllDropdownData(
    userId: number,
    fields: string[],
    keyword?: string,
  ): Promise<CommentEntity[]> {
    try {
      return this.commentRepository.findAllDropdown(userId, fields, keyword);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Retrieve a paginated list of comments by blog for a specific user.
   *
   * @param {number} userId - The ID of the user whose comments to retrieve.
   * @param {number} blogId - The blogId of the comment to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: CommentEntity[]; total: number }>} - The list of comments and the total count.
   */
  async getCommentsByBlogId(
    userId: number,
    blogId: number,
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: CommentEntity[]; total: number }> {
    try {
      return await this.commentRepository.getCommentsByBlogId(
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
