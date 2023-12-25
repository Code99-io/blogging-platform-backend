import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateBlogCategoryDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  blogId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}
