import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateLikeDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  blogId: number;
}
