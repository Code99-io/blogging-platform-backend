import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BlogEntity } from './blog.entity';

@Injectable()
export class BlogRepository extends Repository<BlogEntity> {
  constructor(private dataSource: DataSource) {
    super(BlogEntity, dataSource.createEntityManager());
  }

  /**
   * Find a blog by its ID for a specific user.
   *
   * @param {number} userId - The ID of the user whose blog to retrieve.
   * @param {number} id - The id of the blog to retrieve.
   * @returns {Promise<BlogEntity>} - The blog object.
   */
  async findById(userId: number, id: number): Promise<BlogEntity> {
    return await this.findOne({
      where: { id, author: { id: userId } },
      relations: [],
    });
  }

  /**
   * Retrieve blogs based on search criteria, pagination, and user ID
   *
   * @param {number} userId - The ID of the user whose blog to retrieve.
   * @param {number} skip - The number of records to skip for pagination.
   * @param {number} take - The number of records to retrieve for pagination.
   * @param {string} searchTerm - Optional search term for filtering blogs.
   * @returns {Promise<{ result: BlogEntity[]; total: number }>} - The blogs and total count.
   */
  async getAll(
    userId: number,
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: BlogEntity[]; total: number }> {
    // Create a query builder to construct the SQL query for retrieving blogs
    const queryBuilder = this.getQueryBuilder(
      userId,
      ['title', 'content', 'published'],
      searchTerm, // Optional search term for filtering blogs
    );

    // Order blogs by createdAt timestamp in descending order
    queryBuilder.orderBy('blog.createdAt', 'DESC').addSelect('blog.createdAt');

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
   * Retrieve blogs based on search criteria and user ID for dropdown selection.
   *
   * @param {number} userId - The ID of the user whose blog to retrieve.
   * @param {string[]} fields - The fields to select in the query.
   * @param {string} keyword - Optional keyword for filtering blogs.
   * @returns {Promise<BlogEntity[]>} - The blogs.
   */
  async findAllDropdown(
    userId: number,
    fields: string[],
    keyword?: string,
  ): Promise<BlogEntity[]> {
    // Create a query builder to construct the SQL query for retrieving blogs
    const queryBuilder = this.getQueryBuilder(userId, fields, keyword);

    const selectedColumns = fields.map((field) => `blog.${field}`);

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
   * @param {string} keyword - Optional keyword for filtering blogs.
   * @returns {SelectQueryBuilder<BlogEntity>} - The constructed query builder.
   */
  getQueryBuilder(
    userId: number,
    fields: string[],
    keyword?: string,
  ): SelectQueryBuilder<BlogEntity> {
    // Create a query builder for the 'blog' entity
    const queryBuilder = this.createQueryBuilder('blog');

    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (keyword) {
      fields.forEach((field, index) => {
        if (index === 0) {
          queryBuilder.where(`blog.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        } else {
          queryBuilder.orWhere(`blog.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        }
      });
    }

    // Add a condition to filter blogs based on user ID
    queryBuilder.andWhere('blog.author.id = :userId', { userId });

    // Return the constructed query builder
    return queryBuilder;
  }
}
