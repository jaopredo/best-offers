import { Type } from "class-transformer"
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator"
import { PaginationQueryParams } from "types/pagination/pagination.dto"

export class CategoryPostDto {
    @IsNotEmpty()
    name: string
}

export class CategoryPaginationQueryDto extends PaginationQueryParams {
    @IsOptional()
    name: string = ''
}
