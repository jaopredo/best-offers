import { Module } from '@nestjs/common'

/* MÓDULOS */
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'

/* CONTROLLERS */
import { AuthController } from './auth.controller'

/* SERVIÇOS */
import { AuthService } from './auth.service'

/* REPOSITÓRIOS */
import { User } from 'database/models/user'

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                global: true,
                secret: config.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: config.get('JWT_EXPIRATION')
                }
            })
        })
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}
