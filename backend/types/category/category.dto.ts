import { Type } from "class-transformer"
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator"

export class CategoryPostDto {
    @IsNotEmpty()
    name: string
}

export class CategoryPaginationQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit: number = 10

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page: number = 1

    @IsOptional()
    name: string = ''
}
