import { Brackets, DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DraftEntity } from './draft.entity';

@Injectable()
export class DraftRepository extends Repository<DraftEntity> {
  constructor(private dataSource: DataSource) {
    super(DraftEntity, dataSource.createEntityManager());
  }

  /**
   * Find a draft by its ID for a specific user.
   *
   * @param {number} userId - The ID of the user whose draft to retrieve.
   * @param {number} id - The id of the draft to retrieve.
   * @returns {Promise<DraftEntity>} - The draft object.
   */
  async findById(userId: number, id: number): Promise<DraftEntity> {
    return await this.findOne({
      where: { id, createdBy: { id: userId } },
      relations: ['blog'],
    });
  }

  /**
   * Retrieve drafts based on search criteria, pagination, and user ID
   *
   * @param {number} userId - The ID of the user whose draft to retrieve.
   * @param {number} skip - The number of records to skip for pagination.
   * @param {number} take - The number of records to retrieve for pagination.
   * @param {string} searchTerm - Optional search term for filtering drafts.
   * @returns {Promise<{ result: DraftEntity[]; total: number }>} - The drafts and total count.
   */
  async getAll(
    userId: number,
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: DraftEntity[]; total: number }> {
    // Create a query builder to construct the SQL query for retrieving drafts
    const queryBuilder = this.getQueryBuilder(
      userId,
      ['content'],
      searchTerm, // Optional search term for filtering drafts
    );

    queryBuilder
      .innerJoin('draft.blog', 'blog')
      .addSelect(['blog.id', 'blog.title']);

    if (searchTerm) {
      queryBuilder.orWhere(`blog.title LIKE :keyword`, {
        keyword: `${searchTerm}%`,
      });
    }

    // Order drafts by createdAt timestamp in descending order
    queryBuilder
      .orderBy('draft.createdAt', 'DESC')
      .addSelect('draft.createdAt');

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
   * Retrieve drafts based on search criteria and user ID for dropdown selection.
   *
   * @param {number} userId - The ID of the user whose draft to retrieve.
   * @param {string[]} fields - The fields to select in the query.
   * @param {string} keyword - Optional keyword for filtering drafts.
   * @returns {Promise<DraftEntity[]>} - The drafts.
   */
  async findAllDropdown(
    userId: number,
    fields: string[],
    keyword?: string,
  ): Promise<DraftEntity[]> {
    // Create a query builder to construct the SQL query for retrieving drafts
    const queryBuilder = this.getQueryBuilder(userId, fields, keyword);

    const selectedColumns = fields.map((field) => `draft.${field}`);

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
   * @param {string} keyword - Optional keyword for filtering drafts.
   * @returns {SelectQueryBuilder<DraftEntity>} - The constructed query builder.
   */
  getQueryBuilder(
    userId: number,
    fields: string[],
    keyword?: string,
  ): SelectQueryBuilder<DraftEntity> {
    // Create a query builder for the 'draft' entity
    const queryBuilder = this.createQueryBuilder('draft');

    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (keyword) {
      fields.forEach((field, index) => {
        if (index === 0) {
          queryBuilder.where(`draft.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        } else {
          queryBuilder.orWhere(`draft.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        }
      });
    }

    // Add a condition to filter drafts based on user ID
    queryBuilder.andWhere('draft.createdBy.id = :userId', { userId });

    // Return the constructed query builder
    return queryBuilder;
  }

  /**
   * Retrieve a paginated list of drafts by blog for a specific user.
   *
   * @param {number} userId - The ID of the user whose drafts to retrieve.
   * @param {number} blogId - The blogId of the draft to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} searchTerm - Optional search term for filter.
   * @returns {Promise<{ result: DraftEntity[]; total: number }>} - The list of drafts and the total count.
   */
  async getDraftsByBlogId(
    userId: number,
    blogId: number,
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: DraftEntity[]; total: number }> {
    const fields = ['content'];

    // Create a query builder for the 'draft' entity
    const queryBuilder = this.createQueryBuilder('draft');

    // Add a condition to filter drafts based on user ID
    queryBuilder.andWhere('draft.createdBy.id = :userId', { userId });

    // Add a condition to filter comments based on blogId
    queryBuilder.andWhere('draft.blog.id = :blogId', { blogId });

    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (searchTerm) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          fields.forEach((field) => {
            qb.orWhere(`draft.${field} LIKE :keyword`, {
              keyword: `${searchTerm}%`,
            });
          });
        }),
      );
    }

    // Order drafts by createdAt timestamp in descending order
    queryBuilder
      .orderBy('draft.createdAt', 'DESC')
      .addSelect('draft.createdAt');

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
