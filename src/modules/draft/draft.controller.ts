import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { DraftService } from './draft.service';
import { DraftEntity } from './draft.entity';
import { CreateDraftDto } from './create-draft.dto';
import { UpdateDraftDto } from './update-draft.dto';

@ApiBearerAuth('BearerAuth')
@ApiTags('Drafts')
@Controller('drafts')
export class DraftController {
  constructor(private draftService: DraftService) {}

  /**
   * Get all drafts with pagination support.
   *
   * @param {Request} req - The Express request object.
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering drafts.
   * @returns {Promise<{ result: DraftEntity[]; total: number }>} - The list of drafts and the total count.
   */
  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Optional page for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Optional limit for pagination',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Optional search for searching',
  })
  async getAllDrafts(
    @Req() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: DraftEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.draftService.getAllDrafts(
      req.user.userId,
      skip,
      itemsPerPage,
      search,
    );
  }

  /**
   * Get draft data for dropdowns.
   *
   * @param {Request} req - The Express request object.
   * @param {string} fields - Comma-separated list of fields to retrieve (optional).
   * @param {string} keyword - The keyword for filtering data (optional).
   * @returns {Promise<DraftEntity[]>} - The list of draft data for dropdowns.
   */
  @Get('dropdown')
  @ApiQuery({
    name: 'fields',
    required: false,
    type: String,
    description: 'Optional fields for filtering',
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    type: String,
    description: 'Optional keyword for filtering',
  })
  async getDraftDropdownData(
    @Req() req,
    @Query('fields') fields?: string,
    @Query('keyword') keyword?: string,
  ): Promise<DraftEntity[]> {
    const fieldArray = fields ? fields.split(',') : ['id'];
    return this.draftService.findAllDropdownData(
      req.user.userId,
      fieldArray,
      keyword,
    );
  }

  /**
   * Get a draft by ID.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the draft to retrieve.
   * @returns {Promise<DraftEntity>} - The draft object.
   */
  @Get(':id')
  async getDraftById(
    @Req() req,
    @Param('id') id: number,
  ): Promise<DraftEntity> {
    return this.draftService.getDraftById(req.user.userId, id);
  }

  /**
   * Create a new draft.
   *
   * @param {Request} req - The Express request object.
   * @param {CreateDraftDto} createDraftDto - The DTO for creating a draft.
   * @returns {Promise<DraftEntity>} - The newly created draft object.
   */
  @Post()
  async createDraft(
    @Req() req,
    @Body() createDraftDto: CreateDraftDto,
  ): Promise<DraftEntity> {
    return this.draftService.createDraft(req.user.userId, createDraftDto);
  }

  /**
   * Update an existing draft.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the draft to update.
   * @param {UpdateDraftDto} updateDraftDto - The DTO for updating a draft.
   * @returns {Promise<DraftEntity>} - The updated draft object.
   */
  @Put(':id')
  async updateDraft(
    @Req() req,
    @Param('id') id: number,
    @Body() updateDraftDto: UpdateDraftDto,
  ): Promise<DraftEntity> {
    return this.draftService.updateDraft(req.user.userId, id, updateDraftDto);
  }

  /**
   * Delete a draft by ID.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the draft to delete.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deleteDraft(@Req() req, @Param('id') id: number): Promise<void> {
    return this.draftService.deleteDraft(req.user.userId, id);
  }
}
