import type { Category } from "database/models/category.entity"
import type { Font } from "database/models/font.entity"

import { FontScrapperPostDto } from "../font/font.dto"
import { AdapterPostDto } from "../adapter/adapter.dto"
import { IsNotEmpty, IsNumber, IsObject, IsOptional, ValidateIf, ValidateNested } from "class-validator"
import { Type } from "class-transformer"


export class ScrapperPostDto {
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => FontScrapperPostDto)
    font?: FontScrapperPostDto

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => AdapterPostDto)
    adapter?: AdapterPostDto

    @IsOptional()
    @IsNumber()
    fontId?: number
}


export class ScrapperProcessorData {
    id: number
    font: Font
    category: Category
}
