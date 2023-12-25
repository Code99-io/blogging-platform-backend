import { Brackets, DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BlogCategoryEntity } from './blog-category.entity';

@Injectable()
export class BlogCategoryRepository extends Repository<BlogCategoryEntity> {
  constructor(private dataSource: DataSource) {
    super(BlogCategoryEntity, dataSource.createEntityManager());
  }

  /**
   * Find a blogCategory by its ID
   *
   *
   * @param {number} id - The id of the blogCategory to retrieve.
   * @returns {Promise<BlogCategoryEntity>} - The blogCategory object.
   */
  async findById(id: number): Promise<BlogCategoryEntity> {
    return await this.findOne({
      where: { id },
      relations: ['blog', 'category'],
    });
  }

  /**
   * Retrieve blogCategories based on search criteria, pagination,
   *
   *
   * @param {number} skip - The number of records to skip for pagination.
   * @param {number} take - The number of records to retrieve for pagination.
   * @param {string} searchTerm - Optional search term for filtering blogCategories.
   * @returns {Promise<{ result: BlogCategoryEntity[]; total: number }>} - The blogCategories and total count.
   */
  async getAll(
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: BlogCategoryEntity[]; total: number }> {
    // Create a query builder to construct the SQL query for retrieving blogCategories
    const queryBuilder = this.getQueryBuilder(
      [],
      searchTerm, // Optional search term for filtering blogCategories
    );

    queryBuilder
      .innerJoin('blogCategory.blog', 'blog')
      .addSelect(['blog.id', 'blog.title']);

    if (searchTerm) {
      queryBuilder.orWhere(`blog.title LIKE :keyword`, {
        keyword: `${searchTerm}%`,
      });
    }

    queryBuilder
      .innerJoin('blogCategory.category', 'category')
      .addSelect(['category.id', 'category.name']);

    if (searchTerm) {
      queryBuilder.orWhere(`category.name LIKE :keyword`, {
        keyword: `${searchTerm}%`,
      });
    }

    // Order blogCategories by createdAt timestamp in descending order
    queryBuilder
      .orderBy('blogCategory.createdAt', 'DESC')
      .addSelect('blogCategory.createdAt');

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
   * Retrieve blogCategories based on search criteria and user ID for dropdown selection.
   *
   *
   * @param {string[]} fields - The fields to select in the query.
   * @param {string} keyword - Optional keyword for filtering blogCategories.
   * @returns {Promise<BlogCategoryEntity[]>} - The blogCategories.
   */
  async findAllDropdown(
    fields: string[],
    keyword?: string,
  ): Promise<BlogCategoryEntity[]> {
    // Create a query builder to construct the SQL query for retrieving blogCategories
    const queryBuilder = this.getQueryBuilder(fields, keyword);

    const selectedColumns = fields.map((field) => `blogCategory.${field}`);

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
   * @param {string} keyword - Optional keyword for filtering blogCategories.
   * @returns {SelectQueryBuilder<BlogCategoryEntity>} - The constructed query builder.
   */
  getQueryBuilder(
    fields: string[],
    keyword?: string,
  ): SelectQueryBuilder<BlogCategoryEntity> {
    // Create a query builder for the 'blogCategory' entity
    const queryBuilder = this.createQueryBuilder('blogCategory');

    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (keyword) {
      fields.forEach((field, index) => {
        if (index === 0) {
          queryBuilder.where(`blogCategory.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        } else {
          queryBuilder.orWhere(`blogCategory.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        }
      });
    }

    // Return the constructed query builder
    return queryBuilder;
  }

  /**
   * Retrieve a paginated list of blogCategories by blog.
   *
   *
   * @param {number} blogId - The blogId of the blogCategory to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} searchTerm - Optional search term for filter.
   * @returns {Promise<{ result: BlogCategoryEntity[]; total: number }>} - The list of blogCategories and the total count.
   */
  async getBlogCategoriesByBlogId(
    blogId: number,
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: BlogCategoryEntity[]; total: number }> {
    const fields = [];

    // Create a query builder for the 'blogCategory' entity
    const queryBuilder = this.createQueryBuilder('blogCategory');

    // Add a condition to filter comments based on blogId
    queryBuilder.andWhere('blogCategory.blog.id = :blogId', { blogId });

    queryBuilder
      .innerJoin('blogCategory.category', 'category')
      .addSelect(['category.id', 'category.name']);

    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (searchTerm) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.orWhere(`category.name LIKE :keyword`, {
            keyword: `${searchTerm}%`,
          });

          fields.forEach((field) => {
            qb.orWhere(`blogCategory.${field} LIKE :keyword`, {
              keyword: `${searchTerm}%`,
            });
          });
        }),
      );
    }

    // Order blogCategories by createdAt timestamp in descending order
    queryBuilder
      .orderBy('blogCategory.createdAt', 'DESC')
      .addSelect('blogCategory.createdAt');

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
   * Retrieve a paginated list of blogCategories by category.
   *
   *
   * @param {number} categoryId - The categoryId of the blogCategory to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} searchTerm - Optional search term for filter.
   * @returns {Promise<{ result: BlogCategoryEntity[]; total: number }>} - The list of blogCategories and the total count.
   */
  async getBlogCategoriesByCategoryId(
    categoryId: number,
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: BlogCategoryEntity[]; total: number }> {
    const fields = [];

    // Create a query builder for the 'blogCategory' entity
    const queryBuilder = this.createQueryBuilder('blogCategory');

    // Add a condition to filter comments based on categoryId
    queryBuilder.andWhere('blogCategory.category.id = :categoryId', {
      categoryId,
    });

    queryBuilder
      .innerJoin('blogCategory.blog', 'blog')
      .addSelect(['blog.id', 'blog.title']);

    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (searchTerm) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.orWhere(`blog.title LIKE :keyword`, {
            keyword: `${searchTerm}%`,
          });

          fields.forEach((field) => {
            qb.orWhere(`blogCategory.${field} LIKE :keyword`, {
              keyword: `${searchTerm}%`,
            });
          });
        }),
      );
    }

    // Order blogCategories by createdAt timestamp in descending order
    queryBuilder
      .orderBy('blogCategory.createdAt', 'DESC')
      .addSelect('blogCategory.createdAt');

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
