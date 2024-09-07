import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { FindAllQueryDefaultDTO } from 'src/common/dto/find-all-query-default.dto';
import { FilterStatusDefaultEnum } from 'src/common/enum/filter.enum';

export class FindAllUsersQueryDTO extends FindAllQueryDefaultDTO {
  @ApiProperty()
  @IsOptional()
  @IsEnum(FilterStatusDefaultEnum)
  status?: FilterStatusDefaultEnum;
}

export class GetClientUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  domain_name: string;
}

export class DomainNameDto {
  @ApiProperty()
  @IsNotEmpty()
  domain_name: string;
}
