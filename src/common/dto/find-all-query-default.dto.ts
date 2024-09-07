import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { PAGINATION_CONSTANTS } from '../constants/query.constant';
import { SortByDefaultEnum } from '../enum/filter.enum';

export class FindAllQueryDefaultDTO {
  @IsOptional()
  search_text?: string = '';

  @IsOptional()
  @IsInt()
  @Min(PAGINATION_CONSTANTS.DEFAULT_PAGE_NO)
  @Type(() => Number)
  page_no?: number = PAGINATION_CONSTANTS.DEFAULT_PAGE_NO;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  page_size?: number = PAGINATION_CONSTANTS.DEFAULT_PAGE_SIZE;

  @IsOptional()
  @IsEnum(SortByDefaultEnum)
  sort_by?: SortByDefaultEnum = SortByDefaultEnum.NEWEST;
}
