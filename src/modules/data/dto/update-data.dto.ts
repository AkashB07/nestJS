import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateDataDto } from './create-data.dto';

export class UpdateDataDto extends PartialType(CreateDataDto) {
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
