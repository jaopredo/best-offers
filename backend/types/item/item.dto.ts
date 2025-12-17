import { IsNotEmpty, IsNumber, IsOptional, IsUrl } from "class-validator"
import { PaginationQueryParams } from "types/pagination/pagination.dto"

export class ItemPostDto {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    @IsNumber()
    price: number

    @IsNotEmpty()
    url: string

    @IsOptional()
    seller: string

    @IsNotEmpty()
    @IsNumber()
    categoryId: number

    @IsNotEmpty()
    @IsNumber()
    fontId: number
}

export class ItemUpdateDto {
    @IsOptional()
    name: string

    @IsOptional()
    @IsNumber()
    price: number

    @IsOptional()
    url: string

    @IsOptional()
    seller?: string

    @IsOptional()
    @IsNumber()
    categoryId: number

    @IsOptional()
    @IsNumber()
    fontId: number
}

export class ItemPaginationQueryDto extends PaginationQueryParams {
    @IsOptional()
    name: string

    @IsOptional()
    @IsNumber()
    price: number

    @IsOptional()
    url: string

    @IsOptional()
    seller?: string

    @IsOptional()
    @IsNumber()
    categoryId: number

    @IsOptional()
    @IsNumber()
    fontId: number
}
