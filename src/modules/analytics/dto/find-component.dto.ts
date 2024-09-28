import {
    IsOptional,
} from "class-validator";

export class FindComponentQueryDTO {
    @IsOptional()
    page_size?: string;

    @IsOptional()
    page_no?: string;
}
