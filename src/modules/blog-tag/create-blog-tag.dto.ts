import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateBlogTagDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  blogId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  tagId: number;
}
