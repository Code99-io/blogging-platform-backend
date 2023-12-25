import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional } from 'class-validator';

export class UpdateDraftDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  blogId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  content?: string;
}
