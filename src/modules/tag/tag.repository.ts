import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TagEntity } from './tag.entity';

@Injectable()
export class TagRepository extends Repository<TagEntity> {
  constructor(private dataSource: DataSource) {
    super(TagEntity, dataSource.createEntityManager());
  }

  /**
   * Find a tag by its ID
   *
   *
   * @param {number} id - The id of the tag to retrieve.
   * @returns {Promise<TagEntity>} - The tag object.
   */
  async findById(id: number): Promise<TagEntity> {
    return await this.findOne({
      where: { id },
      relations: [],
    });
  }

  /**
   * Retrieve tags based on search criteria, pagination,
   *
   *
   * @param {number} skip - The number of records to skip for pagination.
   * @param {number} take - The number of records to retrieve for pagination.
   * @param {string} searchTerm - Optional search term for filtering tags.
   * @returns {Promise<{ result: TagEntity[]; total: number }>} - The tags and total count.
   */
  async getAll(
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: TagEntity[]; total: number }> {
    // Create a query builder to construct the SQL query for retrieving tags
    const queryBuilder = this.getQueryBuilder(
      ['name'],
      searchTerm, // Optional search term for filtering tags
    );

    // Order tags by createdAt timestamp in descending order
    queryBuilder.orderBy('tag.createdAt', 'DESC').addSelect('tag.createdAt');

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
   * Retrieve tags based on search criteria and user ID for dropdown selection.
   *
   *
   * @param {string[]} fields - The fields to select in the query.
   * @param {string} keyword - Optional keyword for filtering tags.
   * @returns {Promise<TagEntity[]>} - The tags.
   */
  async findAllDropdown(
    fields: string[],
    keyword?: string,
  ): Promise<TagEntity[]> {
    // Create a query builder to construct the SQL query for retrieving tags
    const queryBuilder = this.getQueryBuilder(fields, keyword);

    const selectedColumns = fields.map((field) => `tag.${field}`);

    // Set the select and take properties
    queryBuilder.select(selectedColumns).take(5);

    // Execute the query and return the result
    return await queryBuilder.getMany();
  }

  /**
   * Helper function to create a query builder based on fields, optional keyword
   *
   *
   * @param {string[]} fields - The fields to include in the search.
   * @param {string} keyword - Optional keyword for filtering tags.
   * @returns {SelectQueryBuilder<TagEntity>} - The constructed query builder.
   */
  getQueryBuilder(
    fields: string[],
    keyword?: string,
  ): SelectQueryBuilder<TagEntity> {
    // Create a query builder for the 'tag' entity
    const queryBuilder = this.createQueryBuilder('tag');

    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (keyword) {
      fields.forEach((field, index) => {
        if (index === 0) {
          queryBuilder.where(`tag.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        } else {
          queryBuilder.orWhere(`tag.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        }
      });
    }

    // Return the constructed query builder
    return queryBuilder;
  }
}
