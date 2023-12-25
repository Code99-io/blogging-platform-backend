import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateLikeDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  blogId?: number;
}
