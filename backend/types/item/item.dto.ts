import { IsNotEmpty, IsNumber, IsOptional } from "class-validator"
import { Category } from "database/models/category"
import { Font } from "database/models/font"

export class ItemPostDto {
    @IsNotEmpty()
    name: string

    @IsNumber()
    price: number

    @IsNotEmpty()
    url: string

    @IsOptional()
    seller?: string

    @IsNotEmpty()
    @IsNumber()
    categoryId: number

    @IsNotEmpty()
    @IsNumber()
    fontId: number
}

export class ItemDto {
    name: string
    price: number
    url: string
    seller?: string
    category: Category
    font: Font
}
