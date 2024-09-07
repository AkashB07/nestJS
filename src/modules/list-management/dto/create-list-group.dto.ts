import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateListGroupDto {
  @IsNotEmpty()
  @MaxLength(50)
  text: string;
}
