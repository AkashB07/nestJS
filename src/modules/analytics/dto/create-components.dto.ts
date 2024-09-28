import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import {
  BaseObjectEnum,
  CompareObjectiveEnum,
  ComparisonTypeEnum,
  ComponentTypeEnum,
  DateGranularityEnum,
  DurationTypeEnum,
  GraphTypeEnum,
  ShowRankTypeEnum,
} from '../constants/components.enum';
import { Type } from 'class-transformer';

class CriteriaFilterDto {
  @IsNotEmpty()
  @IsString()
  comparator: string;

  @IsNotEmpty()
  @IsString()
  api_name: string;

  @IsNotEmpty()
  @IsString()
  @IsString()
  @ValidateIf(o => o.value !== null)
  value: string | null;
}

export class CreateComponentsDto {
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsUUID('4')
  analytics: string;

  @IsNotEmpty()
  @IsEnum(ComponentTypeEnum)
  component_type: ComponentTypeEnum;

  @IsNotEmpty()
  @IsEnum(GraphTypeEnum)
  graph_type: GraphTypeEnum;

  @IsNotEmpty()
  @IsEnum(BaseObjectEnum)
  base_object: BaseObjectEnum;

  @IsOptional()
  @IsBoolean()
  is_date: boolean;

  @IsOptional()
  @IsEnum(DateGranularityEnum)
  date_granularity: DateGranularityEnum;

  @IsNotEmpty()
  column: string;

  @IsOptional()
  @IsBoolean()
  is_child_date: boolean;

  @IsOptional()
  @IsEnum(DateGranularityEnum)
  child_date_granularity: DateGranularityEnum;

  @IsOptional()
  @IsBoolean()
  is_child: boolean;

  @IsOptional()
  child_column: string;

  @IsOptional()
  @IsEnum(DurationTypeEnum)
  duration_type: DurationTypeEnum;

  @IsOptional()
  @IsEnum(ShowRankTypeEnum)
  show_rank: ShowRankTypeEnum;

  @IsOptional()
  @IsDateString()
  custom_from_date: Date;

  @IsOptional()
  @IsDateString()
  custom_to_date: Date;

  @IsOptional()
  @IsPositive()
  custom_last_days: number;

  @IsOptional()
  @IsEnum(ComparisonTypeEnum)
  compare_to: ComparisonTypeEnum;

  @IsOptional()
  @IsDateString()
  compare_from_date: Date;

  @IsOptional()
  @IsDateString()
  compare_to_date: Date;

  @IsOptional()
  @IsEnum(CompareObjectiveEnum)
  compare_objective: CompareObjectiveEnum;

  @IsOptional()
  @IsBoolean()
  is_comparator: boolean;

  @IsOptional()
  @IsArray()
  // @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CriteriaFilterDto)
  criteria_filters?: CriteriaFilterDto[];
}
