import { IsEmail, IsNotEmpty, MinLength } from "class-validator"

export class UserRegisterDto {
    @IsNotEmpty()
    name: string

    @IsEmail()
    email: string

    @IsNotEmpty()
    @MinLength(8)
    password: string
}


export interface UserInterface extends UserRegisterDto {
    id: number
    role: 'user'|'admin'
}


export class UserLoginDto {
    @IsEmail()
    email: string

    @IsNotEmpty()
    password: string
}
