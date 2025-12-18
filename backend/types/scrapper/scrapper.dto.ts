import type { Adapter } from "database/models/adapter"
import type { Category } from "database/models/category"
import type { Font } from "database/models/font"

import { FontPostDto } from "../font/font.dto"
import { AdapterPostDto } from "../adapter/adapter.dto"
import { IsNumber, ValidateIf, ValidateNested } from "class-validator"
import { Type } from "class-transformer"


export class ScrapperPostDto {
    @ValidateIf(o => o.fontId == null)
    @ValidateNested()
    @Type(() => FontPostDto)
    font?: FontPostDto

    @ValidateIf(o => o.fontId == null)
    @ValidateNested()
    @Type(() => AdapterPostDto)
    adapter?: AdapterPostDto

    @ValidateIf(o => o.font == null && o.adapter == null)
    @IsNumber()
    fontId?: number
}


export class ScrapperProcessorData {
    id: number
    font: Font
    category: Category
}
