import { Brackets, DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CommentEntity } from './comment.entity';

@Injectable()
export class CommentRepository extends Repository<CommentEntity> {
  constructor(private dataSource: DataSource) {
    super(CommentEntity, dataSource.createEntityManager());
  }

  /**
   * Find a comment by its ID for a specific user.
   *
   * @param {number} userId - The ID of the user whose comment to retrieve.
   * @param {number} id - The id of the comment to retrieve.
   * @returns {Promise<CommentEntity>} - The comment object.
   */
  async findById(userId: number, id: number): Promise<CommentEntity> {
    return await this.findOne({
      where: { id, user: { id: userId } },
      relations: ['blog'],
    });
  }

  /**
   * Retrieve comments based on search criteria, pagination, and user ID
   *
   * @param {number} userId - The ID of the user whose comment to retrieve.
   * @param {number} skip - The number of records to skip for pagination.
   * @param {number} take - The number of records to retrieve for pagination.
   * @param {string} searchTerm - Optional search term for filtering comments.
   * @returns {Promise<{ result: CommentEntity[]; total: number }>} - The comments and total count.
   */
  async getAll(
    userId: number,
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: CommentEntity[]; total: number }> {
    // Create a query builder to construct the SQL query for retrieving comments
    const queryBuilder = this.getQueryBuilder(
      userId,
      ['content'],
      searchTerm, // Optional search term for filtering comments
    );

    queryBuilder
      .innerJoin('comment.blog', 'blog')
      .addSelect(['blog.id', 'blog.title']);

    if (searchTerm) {
      queryBuilder.orWhere(`blog.title LIKE :keyword`, {
        keyword: `${searchTerm}%`,
      });
    }

    // Order comments by createdAt timestamp in descending order
    queryBuilder
      .orderBy('comment.createdAt', 'DESC')
      .addSelect('comment.createdAt');

    // Set the select, skip, and take properties for pagination
    queryBuilder.select().take(take).skip(skip);

    // Execute the query and return the result along with the total count
    const [result, total] = await queryBuilder.getManyAndCount();

    return {
      result,
      total,
    };
  }

  /**
   * Retrieve comments based on search criteria and user ID for dropdown selection.
   *
   * @param {number} userId - The ID of the user whose comment to retrieve.
   * @param {string[]} fields - The fields to select in the query.
   * @param {string} keyword - Optional keyword for filtering comments.
   * @returns {Promise<CommentEntity[]>} - The comments.
   */
  async findAllDropdown(
    userId: number,
    fields: string[],
    keyword?: string,
  ): Promise<CommentEntity[]> {
    // Create a query builder to construct the SQL query for retrieving comments
    const queryBuilder = this.getQueryBuilder(userId, fields, keyword);

    const selectedColumns = fields.map((field) => `comment.${field}`);

    // Set the select and take properties
    queryBuilder.select(selectedColumns).take(5);

    // Execute the query and return the result
    return await queryBuilder.getMany();
  }

  /**
   * Helper function to create a query builder based on fields, optional keyword  and user Id
   *
   * @param {number} userId - The ID of the user for the query.
   * @param {string[]} fields - The fields to include in the search.
   * @param {string} keyword - Optional keyword for filtering comments.
   * @returns {SelectQueryBuilder<CommentEntity>} - The constructed query builder.
   */
  getQueryBuilder(
    userId: number,
    fields: string[],
    keyword?: string,
  ): SelectQueryBuilder<CommentEntity> {
    // Create a query builder for the 'comment' entity
    const queryBuilder = this.createQueryBuilder('comment');

    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (keyword) {
      fields.forEach((field, index) => {
        if (index === 0) {
          queryBuilder.where(`comment.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        } else {
          queryBuilder.orWhere(`comment.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        }
      });
    }

    // Add a condition to filter comments based on user ID
    queryBuilder.andWhere('comment.user.id = :userId', { userId });

    // Return the constructed query builder
    return queryBuilder;
  }

  /**
   * Retrieve a paginated list of comments by blog for a specific user.
   *
   * @param {number} userId - The ID of the user whose comments to retrieve.
   * @param {number} blogId - The blogId of the comment to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} searchTerm - Optional search term for filter.
   * @returns {Promise<{ result: CommentEntity[]; total: number }>} - The list of comments and the total count.
   */
  async getCommentsByBlogId(
    userId: number,
    blogId: number,
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: CommentEntity[]; total: number }> {
    const fields = ['content'];

    // Create a query builder for the 'comment' entity
    const queryBuilder = this.createQueryBuilder('comment');

    // Add a condition to filter comments based on user ID
    queryBuilder.andWhere('comment.user.id = :userId', { userId });

    // Add a condition to filter comments based on blogId
    queryBuilder.andWhere('comment.blog.id = :blogId', { blogId });

    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (searchTerm) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          fields.forEach((field) => {
            qb.orWhere(`comment.${field} LIKE :keyword`, {
              keyword: `${searchTerm}%`,
            });
          });
        }),
      );
    }

    // Order comments by createdAt timestamp in descending order
    queryBuilder
      .orderBy('comment.createdAt', 'DESC')
      .addSelect('comment.createdAt');

    // Set the select, skip, and take properties for pagination
    queryBuilder.select().take(take).skip(skip);

    // Execute the query and return the result along with the total count
    const [result, total] = await queryBuilder.getManyAndCount();

    return {
      result,
      total,
    };
  }
}
