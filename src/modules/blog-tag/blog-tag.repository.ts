import { Brackets, DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BlogTagEntity } from './blog-tag.entity';

@Injectable()
export class BlogTagRepository extends Repository<BlogTagEntity> {
  constructor(private dataSource: DataSource) {
    super(BlogTagEntity, dataSource.createEntityManager());
  }

  /**
   * Find a blogTag by its ID
   *
   *
   * @param {number} id - The id of the blogTag to retrieve.
   * @returns {Promise<BlogTagEntity>} - The blogTag object.
   */
  async findById(id: number): Promise<BlogTagEntity> {
    return await this.findOne({
      where: { id },
      relations: ['blog', 'tag'],
    });
  }

  /**
   * Retrieve blogTags based on search criteria, pagination,
   *
   *
   * @param {number} skip - The number of records to skip for pagination.
   * @param {number} take - The number of records to retrieve for pagination.
   * @param {string} searchTerm - Optional search term for filtering blogTags.
   * @returns {Promise<{ result: BlogTagEntity[]; total: number }>} - The blogTags and total count.
   */
  async getAll(
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: BlogTagEntity[]; total: number }> {
    // Create a query builder to construct the SQL query for retrieving blogTags
    const queryBuilder = this.getQueryBuilder(
      [],
      searchTerm, // Optional search term for filtering blogTags
    );

    queryBuilder
      .innerJoin('blogTag.blog', 'blog')
      .addSelect(['blog.id', 'blog.title']);

    if (searchTerm) {
      queryBuilder.orWhere(`blog.title LIKE :keyword`, {
        keyword: `${searchTerm}%`,
      });
    }

    queryBuilder
      .innerJoin('blogTag.tag', 'tag')
      .addSelect(['tag.id', 'tag.name']);

    if (searchTerm) {
      queryBuilder.orWhere(`tag.name LIKE :keyword`, {
        keyword: `${searchTerm}%`,
      });
    }

    // Order blogTags by createdAt timestamp in descending order
    queryBuilder
      .orderBy('blogTag.createdAt', 'DESC')
      .addSelect('blogTag.createdAt');

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
   * Retrieve blogTags based on search criteria and user ID for dropdown selection.
   *
   *
   * @param {string[]} fields - The fields to select in the query.
   * @param {string} keyword - Optional keyword for filtering blogTags.
   * @returns {Promise<BlogTagEntity[]>} - The blogTags.
   */
  async findAllDropdown(
    fields: string[],
    keyword?: string,
  ): Promise<BlogTagEntity[]> {
    // Create a query builder to construct the SQL query for retrieving blogTags
    const queryBuilder = this.getQueryBuilder(fields, keyword);

    const selectedColumns = fields.map((field) => `blogTag.${field}`);

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
   * @param {string} keyword - Optional keyword for filtering blogTags.
   * @returns {SelectQueryBuilder<BlogTagEntity>} - The constructed query builder.
   */
  getQueryBuilder(
    fields: string[],
    keyword?: string,
  ): SelectQueryBuilder<BlogTagEntity> {
    // Create a query builder for the 'blogTag' entity
    const queryBuilder = this.createQueryBuilder('blogTag');

    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (keyword) {
      fields.forEach((field, index) => {
        if (index === 0) {
          queryBuilder.where(`blogTag.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        } else {
          queryBuilder.orWhere(`blogTag.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        }
      });
    }

    // Return the constructed query builder
    return queryBuilder;
  }

  /**
   * Retrieve a paginated list of blogTags by blog.
   *
   *
   * @param {number} blogId - The blogId of the blogTag to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} searchTerm - Optional search term for filter.
   * @returns {Promise<{ result: BlogTagEntity[]; total: number }>} - The list of blogTags and the total count.
   */
  async getBlogTagsByBlogId(
    blogId: number,
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: BlogTagEntity[]; total: number }> {
    const fields = [];

    // Create a query builder for the 'blogTag' entity
    const queryBuilder = this.createQueryBuilder('blogTag');

    // Add a condition to filter comments based on blogId
    queryBuilder.andWhere('blogTag.blog.id = :blogId', { blogId });

    queryBuilder
      .innerJoin('blogTag.tag', 'tag')
      .addSelect(['tag.id', 'tag.name']);

    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (searchTerm) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.orWhere(`tag.name LIKE :keyword`, {
            keyword: `${searchTerm}%`,
          });

          fields.forEach((field) => {
            qb.orWhere(`blogTag.${field} LIKE :keyword`, {
              keyword: `${searchTerm}%`,
            });
          });
        }),
      );
    }

    // Order blogTags by createdAt timestamp in descending order
    queryBuilder
      .orderBy('blogTag.createdAt', 'DESC')
      .addSelect('blogTag.createdAt');

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
   * Retrieve a paginated list of blogTags by tag.
   *
   *
   * @param {number} tagId - The tagId of the blogTag to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} searchTerm - Optional search term for filter.
   * @returns {Promise<{ result: BlogTagEntity[]; total: number }>} - The list of blogTags and the total count.
   */
  async getBlogTagsByTagId(
    tagId: number,
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: BlogTagEntity[]; total: number }> {
    const fields = [];

    // Create a query builder for the 'blogTag' entity
    const queryBuilder = this.createQueryBuilder('blogTag');

    // Add a condition to filter comments based on tagId
    queryBuilder.andWhere('blogTag.tag.id = :tagId', { tagId });

    queryBuilder
      .innerJoin('blogTag.blog', 'blog')
      .addSelect(['blog.id', 'blog.title']);

    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (searchTerm) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.orWhere(`blog.title LIKE :keyword`, {
            keyword: `${searchTerm}%`,
          });

          fields.forEach((field) => {
            qb.orWhere(`blogTag.${field} LIKE :keyword`, {
              keyword: `${searchTerm}%`,
            });
          });
        }),
      );
    }

    // Order blogTags by createdAt timestamp in descending order
    queryBuilder
      .orderBy('blogTag.createdAt', 'DESC')
      .addSelect('blogTag.createdAt');

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
