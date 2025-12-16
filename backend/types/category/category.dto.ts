import { IsNotEmpty } from "class-validator"

export class CategoryPostDto {
    @IsNotEmpty()
    name: string
}
