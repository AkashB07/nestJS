import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateListItemDto {
  @IsNotEmpty()
  @MaxLength(150)
  text: string;
}
