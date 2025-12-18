import type { Adapter } from "database/models/adapter"
import type { Category } from "database/models/category"
import type { Font } from "database/models/font"

import { FontDto } from "../font/font.dto"
import { AdapterDto } from "../adapter/adapter.dto"
import { IsNotEmpty, ValidateNested } from "class-validator"
import { Type } from "class-transformer"


export class ScrapperPostDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => FontDto)
    font: FontDto

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => AdapterDto)
    adapter: AdapterDto
}


export class ScrapperProcessorData {
    font: Font
    adapter: Adapter
    category: Category
    searchURL: string
    formInputName: string
}
