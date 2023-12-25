import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateTagDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;
}
