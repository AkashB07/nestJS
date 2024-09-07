import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateListGroupDto } from './create-list-group.dto';

export class UpdateListGroupDto extends PartialType(CreateListGroupDto) {
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
