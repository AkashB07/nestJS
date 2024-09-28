import {
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

export class CreateAnalyticsDto {
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
