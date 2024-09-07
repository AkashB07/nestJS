import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';
import { FindAllQueryDefaultDTO } from '../../../common/dto/find-all-query-default.dto';
export class FindListByGroupCodeDTO {
  @IsNotEmpty()
  groupCode: string;
}

export class FindListItemByGroupDTO extends FindAllQueryDefaultDTO {
  @IsOptional()
  group_code: string;

  @IsOptional()
  @IsNumberString()
  id: string;
}
