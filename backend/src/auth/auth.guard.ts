import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtPayload, RequestWithUser } from 'types/auth/auth.dto';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>(); // Pego a request
        const token = this.extractTokenFromHeader(request); // Extraio o token
        if (!token) {
            // Se eu não possuir nenhum token
            throw new UnauthorizedException(
                'Nenhum token fornecido, faça login antes de acessar esta rota',
            );
        }
        try {
            // Pego as informações presentes no token
            const payload = await this.jwtService.verifyAsync<JwtPayload>(
                token,
                {
                    secret: process.env.SECRET,
                },
            );
            // Coloco uma propriedade USER dentro da requisição
            request['user'] = payload;
        } catch {
            // Se algo der errado, então o token está com erro
            throw new UnauthorizedException(
                'Algo deu errado na autentificação, tente fazer login novamente',
            );
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        // Separo pois a autorização esperada é do tipo:
        // "Bearer <token>"
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // Vou pegar as roles associadas com a requisição atual
        const roles = this.reflector.get(Roles, context.getHandler());
        if (!roles) {
            // Se não tiver nenhuma, ele só passa automaticamente
            return true;
        }

        // Pego a requisição e o usuário nela (Deve sempre passar pela
        // guard do JWT antes)
        const request = context.switchToHttp().getRequest<RequestWithUser>();
        const user = request.user;

        if (!roles.includes(user.role)) {
            throw new UnauthorizedException(
                'Você não tem permissão para acessar esta rota',
            );
        }

        return true;
    }
}
