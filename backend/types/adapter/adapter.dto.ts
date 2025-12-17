import { IsNotEmpty, IsOptional } from "class-validator"
import { PaginationQueryParams } from "types/pagination/pagination.dto"

export class AdapterPostDto {
    @IsNotEmpty()
    searchURL: string
    
    @IsOptional()
    searchParameter: string

    @IsNotEmpty()
    sep: string

    @IsNotEmpty()
    itemURLClassName: string

    @IsNotEmpty()
    itemContainerClassName: string

    @IsNotEmpty()
    itemNameClassName: string

    @IsNotEmpty()
    itemPriceClassName: string

    @IsNotEmpty()
    itemSellerClassName: string
}


export class AdapterUpdateDto {
    @IsOptional()
    searchURL: string
    
    @IsOptional()
    searchParameter: string

    @IsOptional()
    sep: string

    @IsOptional()
    itemURLClassName: string

    @IsOptional()
    itemContainerClassName: string

    @IsOptional()
    itemNameClassName: string

    @IsOptional()
    itemPriceClassName: string

    @IsOptional()
    itemSellerClassName: string
}


export class AdapterPaginationQueryDto extends PaginationQueryParams {
    @IsOptional()
    searchURL: string
    
    @IsOptional()
    searchParameter: string

    @IsOptional()
    sep: string

    @IsOptional()
    itemURLClassName: string

    @IsOptional()
    itemContainerClassName: string

    @IsOptional()
    itemNameClassName: string

    @IsOptional()
    itemPriceClassName: string

    @IsOptional()
    itemSellerClassName: string
}
