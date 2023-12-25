import { Brackets, DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { LikeEntity } from './like.entity';

@Injectable()
export class LikeRepository extends Repository<LikeEntity> {
  constructor(private dataSource: DataSource) {
    super(LikeEntity, dataSource.createEntityManager());
  }

  /**
   * Find a like by its ID for a specific user.
   *
   * @param {number} userId - The ID of the user whose like to retrieve.
   * @param {number} id - The id of the like to retrieve.
   * @returns {Promise<LikeEntity>} - The like object.
   */
  async findById(userId: number, id: number): Promise<LikeEntity> {
    return await this.findOne({
      where: { id, user: { id: userId } },
      relations: ['blog'],
    });
  }

  /**
   * Retrieve likes based on search criteria, pagination, and user ID
   *
   * @param {number} userId - The ID of the user whose like to retrieve.
   * @param {number} skip - The number of records to skip for pagination.
   * @param {number} take - The number of records to retrieve for pagination.
   * @param {string} searchTerm - Optional search term for filtering likes.
   * @returns {Promise<{ result: LikeEntity[]; total: number }>} - The likes and total count.
   */
  async getAll(
    userId: number,
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: LikeEntity[]; total: number }> {
    // Create a query builder to construct the SQL query for retrieving likes
    const queryBuilder = this.getQueryBuilder(
      userId,
      [],
      searchTerm, // Optional search term for filtering likes
    );

    queryBuilder
      .innerJoin('like.blog', 'blog')
      .addSelect(['blog.id', 'blog.title']);

    if (searchTerm) {
      queryBuilder.orWhere(`blog.title LIKE :keyword`, {
        keyword: `${searchTerm}%`,
      });
    }

    // Order likes by createdAt timestamp in descending order
    queryBuilder.orderBy('like.createdAt', 'DESC').addSelect('like.createdAt');

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
   * Retrieve likes based on search criteria and user ID for dropdown selection.
   *
   * @param {number} userId - The ID of the user whose like to retrieve.
   * @param {string[]} fields - The fields to select in the query.
   * @param {string} keyword - Optional keyword for filtering likes.
   * @returns {Promise<LikeEntity[]>} - The likes.
   */
  async findAllDropdown(
    userId: number,
    fields: string[],
    keyword?: string,
  ): Promise<LikeEntity[]> {
    // Create a query builder to construct the SQL query for retrieving likes
    const queryBuilder = this.getQueryBuilder(userId, fields, keyword);

    const selectedColumns = fields.map((field) => `like.${field}`);

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
   * @param {string} keyword - Optional keyword for filtering likes.
   * @returns {SelectQueryBuilder<LikeEntity>} - The constructed query builder.
   */
  getQueryBuilder(
    userId: number,
    fields: string[],
    keyword?: string,
  ): SelectQueryBuilder<LikeEntity> {
    // Create a query builder for the 'like' entity
    const queryBuilder = this.createQueryBuilder('like');

    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (keyword) {
      fields.forEach((field, index) => {
        if (index === 0) {
          queryBuilder.where(`like.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        } else {
          queryBuilder.orWhere(`like.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        }
      });
    }

    // Add a condition to filter likes based on user ID
    queryBuilder.andWhere('like.user.id = :userId', { userId });

    // Return the constructed query builder
    return queryBuilder;
  }

  /**
   * Retrieve a paginated list of likes by blog for a specific user.
   *
   * @param {number} userId - The ID of the user whose likes to retrieve.
   * @param {number} blogId - The blogId of the like to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} searchTerm - Optional search term for filter.
   * @returns {Promise<{ result: LikeEntity[]; total: number }>} - The list of likes and the total count.
   */
  async getLikesByBlogId(
    userId: number,
    blogId: number,
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: LikeEntity[]; total: number }> {
    const fields = [];

    // Create a query builder for the 'like' entity
    const queryBuilder = this.createQueryBuilder('like');

    // Add a condition to filter likes based on user ID
    queryBuilder.andWhere('like.user.id = :userId', { userId });

    // Add a condition to filter comments based on blogId
    queryBuilder.andWhere('like.blog.id = :blogId', { blogId });

    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (searchTerm) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          fields.forEach((field) => {
            qb.orWhere(`like.${field} LIKE :keyword`, {
              keyword: `${searchTerm}%`,
            });
          });
        }),
      );
    }

    // Order likes by createdAt timestamp in descending order
    queryBuilder.orderBy('like.createdAt', 'DESC').addSelect('like.createdAt');

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
