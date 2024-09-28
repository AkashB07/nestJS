import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateDataDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(50)
  text: string;

  @ApiProperty()
  @IsOptional()
  category_of_law: number;

  @ApiProperty()
  @IsOptional()
  rule: number;
}
