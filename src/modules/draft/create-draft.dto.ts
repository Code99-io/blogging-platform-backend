import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateDraftDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  blogId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
}
