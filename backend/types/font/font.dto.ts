import { Type } from "class-transformer"
import { IsNotEmpty, IsNumber, IsOptional, IsUrl } from "class-validator"
import { PaginationQueryParams } from "types/pagination/pagination.dto"

export class FontPostDto {
    @IsNotEmpty()
    @IsUrl()
    url: string

    @IsNotEmpty()
    name: string
    
    @IsNumber()
    adapterId: number
}

export class FontUpdateDto {
    @IsOptional()
    @IsUrl()
    url: string

    @IsOptional()
    name: string
    
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    adapterId: number
}

export class FontPaginationQueryDto extends PaginationQueryParams {
    @IsOptional()
    name: string

    @IsOptional()
    @IsUrl()
    url: string

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    adapterId: number
}
