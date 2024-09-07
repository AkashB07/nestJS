import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty } from 'class-validator';

export class BulkActiveInActiveDto {

    @IsArray()
    @ArrayNotEmpty()
    ids: string[];

    @IsNotEmpty()
    @IsBoolean()
    is_active?: boolean;
}
