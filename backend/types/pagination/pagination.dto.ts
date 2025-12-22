import { Type } from "class-transformer"
import { IsNumber, IsOptional } from "class-validator"

export interface Pagination<T> {
    data: Array<T>
    metadata: {
        page: number,
        limit: number,
        total: number,
        totalPages: number
    }
}

export class PaginationQueryParams {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit: number = 10

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page: number = 1
}
