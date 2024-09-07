import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateListItemDto } from './create-list-item.dto';

export class UpdateListItemDto extends PartialType(CreateListItemDto) {
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
