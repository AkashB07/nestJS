import { PartialType } from '@nestjs/swagger';
import { CreateComponentsDto } from './create-components.dto';

export class UpdateComponentsDto extends PartialType(CreateComponentsDto) { }
