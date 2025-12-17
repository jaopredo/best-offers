import { Type } from "class-transformer"
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator"
import { PaginationQueryParams } from "types/pagination/pagination.dto"

export class FontPostDto {
    @IsNotEmpty()
    url: string

    @IsNotEmpty()
    name: string
    
    @IsNumber()
    adapterId: number
}

export class FontUpdateDto {

}

export class FontPaginationQueryDto extends PaginationQueryParams {
    @IsOptional()
    name: string

    @IsOptional()
    url: string

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    adapterId: number
}
