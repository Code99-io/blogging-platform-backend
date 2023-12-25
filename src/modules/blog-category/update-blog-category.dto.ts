import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateBlogCategoryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  blogId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  categoryId?: number;
}
