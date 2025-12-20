import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { InjectRepository } from "@nestjs/typeorm"
import bcrypt from 'bcrypt'

/* ENTITIES */
import { User } from "database/models/user.entity"

/* TYPES */
import type { FindOptionsWhere, Repository } from "typeorm"
import type { UserRegisterDto } from "types/auth/auth.dto"

@Injectable()
export class AuthService {
    // Pegando o repositório do usuário para manipulação da Tabela
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private configService: ConfigService
    ){}

    /**
     * Função responsável pelo registro do usuário dentro da database
     * @param {UserRegisterDto} userData Informações de registro do usuário
     */
    async registerUser(userData: UserRegisterDto, role: 'user'|'admin') {
        const user = new User()
        user.email = userData.email
        user.name = userData.name
        user.password = await bcrypt.hash(userData.password, Number(this.configService.get<number>('JWT_SALT_ROUNDS')))
        // Nenhum usuário que está se registrando pode
        // ser registrado como administrador (Assim que registra),
        // apenas ser promovido posteriormente por outro administrador
        user.role = role

        await this.userRepository.save(user)

        return user
    }

    /**
     * Procura um usuário no banco de acordo com o filtro passado. Se nenhum filtro é passado,
     * então todos os usuários são retornados
     * @param {FindOptionsWhere<User> | FindOptionsWhere<User>[]} filter Filtro para achar o usuário
     */
    async getUser(filter: FindOptionsWhere<User> | FindOptionsWhere<User>[]) {
        return await this.userRepository.findBy(filter)
    }
}
