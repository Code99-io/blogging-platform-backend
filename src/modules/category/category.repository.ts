import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CategoryEntity } from './category.entity';

@Injectable()
export class CategoryRepository extends Repository<CategoryEntity> {
  constructor(private dataSource: DataSource) {
    super(CategoryEntity, dataSource.createEntityManager());
  }

  /**
   * Find a category by its ID
   *
   *
   * @param {number} id - The id of the category to retrieve.
   * @returns {Promise<CategoryEntity>} - The category object.
   */
  async findById(id: number): Promise<CategoryEntity> {
    return await this.findOne({
      where: { id },
      relations: [],
    });
  }

  /**
   * Retrieve categories based on search criteria, pagination,
   *
   *
   * @param {number} skip - The number of records to skip for pagination.
   * @param {number} take - The number of records to retrieve for pagination.
   * @param {string} searchTerm - Optional search term for filtering categories.
   * @returns {Promise<{ result: CategoryEntity[]; total: number }>} - The categories and total count.
   */
  async getAll(
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: CategoryEntity[]; total: number }> {
    // Create a query builder to construct the SQL query for retrieving categories
    const queryBuilder = this.getQueryBuilder(
      ['name'],
      searchTerm, // Optional search term for filtering categories
    );

    // Order categories by createdAt timestamp in descending order
    queryBuilder
      .orderBy('category.createdAt', 'DESC')
      .addSelect('category.createdAt');

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
   * Retrieve categories based on search criteria and user ID for dropdown selection.
   *
   *
   * @param {string[]} fields - The fields to select in the query.
   * @param {string} keyword - Optional keyword for filtering categories.
   * @returns {Promise<CategoryEntity[]>} - The categories.
   */
  async findAllDropdown(
    fields: string[],
    keyword?: string,
  ): Promise<CategoryEntity[]> {
    // Create a query builder to construct the SQL query for retrieving categories
    const queryBuilder = this.getQueryBuilder(fields, keyword);

    const selectedColumns = fields.map((field) => `category.${field}`);

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
   * @param {string} keyword - Optional keyword for filtering categories.
   * @returns {SelectQueryBuilder<CategoryEntity>} - The constructed query builder.
   */
  getQueryBuilder(
    fields: string[],
    keyword?: string,
  ): SelectQueryBuilder<CategoryEntity> {
    // Create a query builder for the 'category' entity
    const queryBuilder = this.createQueryBuilder('category');

    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (keyword) {
      fields.forEach((field, index) => {
        if (index === 0) {
          queryBuilder.where(`category.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        } else {
          queryBuilder.orWhere(`category.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        }
      });
    }

    // Return the constructed query builder
    return queryBuilder;
  }
}
