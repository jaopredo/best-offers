import {
    Controller,
    Post,
    Get,
    Body,
    HttpCode,
    BadRequestException,
    UnauthorizedException,
    NotFoundException,
    UseGuards,
    Req,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { Request } from 'express';

/* TIPOS */
import {
    UserRegisterDto,
    UserLoginDto,
    RequestWithUser,
} from 'types/auth/auth.dto';

/* GUARDS */
import { JwtAuthGuard } from './auth.guard';

/* SERVIÇOS */
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private jwtService: JwtService,
    ) {}

    @Post('/register')
    async register(@Body() user: UserRegisterDto) {
        // Checando se já não existe um usuário registrado
        // com o mesmo email
        const users = await this.authService.getUser({ email: user.email });
        if (users.length != 0) {
            throw new BadRequestException(
                'Um usuário com este email já está cadastrado',
            );
        }

        // Cria o usuário no banco
        const registeredUser = await this.authService.registerUser(
            user,
            'user',
        );

        // Retorna uma mensagem de sucesso
        return {
            message: 'Usuário registrado com sucesso',
            token: await this.jwtService.signAsync({
                name: registeredUser.name,
                email: registeredUser.email,
                role: registeredUser.role,
            }),
            statusCode: 201,
        };
    }

    // Essa rota é apenas para eu fazer os testes no frontend, será removida posteriormente
    @Post('/registerAdmin')
    async registerAdmin(@Body() user: UserRegisterDto) {
        // Checando se já não existe um usuário registrado
        // com o mesmo email
        const users = await this.authService.getUser({ email: user.email });
        if (users.length != 0) {
            throw new BadRequestException(
                'Um usuário com este email já está cadastrado',
            );
        }

        // Cria o usuário no banco
        const registeredUser = await this.authService.registerUser(
            user,
            'admin',
        );

        // Retorna uma mensagem de sucesso
        return {
            message: 'Administrador registrado com sucesso',
            token: await this.jwtService.signAsync({
                name: registeredUser.name,
                email: registeredUser.email,
                role: registeredUser.role,
            }),
            statusCode: 201,
        };
    }

    @Post('/login')
    @HttpCode(200)
    async login(@Body() payload: UserLoginDto) {
        // Procuro o usuário com o email informado
        const users = await this.authService.getUser({ email: payload.email });
        if (users.length == 0) {
            throw new NotFoundException(
                'Nenhum usuário com esse email encontrado',
            );
        }

        // Pego o primeiro usuário (Em teoria sempre terá apenas 1)
        const user = users[0];

        // Faço a comparação entre a senha passada e a senha hash
        if (!bcrypt.compareSync(payload.password, user.password)) {
            throw new UnauthorizedException(
                'Senha incorreta, por favor, tente novamente',
            );
        }

        // Retorno a resposta da requisição
        return {
            message: 'Usuário logado com sucesso',
            token: await this.jwtService.signAsync({
                name: user.name,
                email: user.email,
                role: user.role,
            }),
            statusCode: 200,
        };
    }

    @Get('/me')
    @UseGuards(JwtAuthGuard)
    me(@Req() req: RequestWithUser) {
        return {
            message: 'Informações extraídas com sucesso',
            statusCode: 200,
            user: {
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
            },
        };
    }
}
