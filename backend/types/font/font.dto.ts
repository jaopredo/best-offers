import { IsNotEmpty, IsNumber } from "class-validator"

export class FontPostDto {
    @IsNotEmpty()
    url: string

    @IsNotEmpty()
    name: string
    
    @IsNumber()
    adapterId: number
}

export class FontUpdateDto {
    
}
