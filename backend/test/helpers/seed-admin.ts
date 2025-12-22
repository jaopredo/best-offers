// test/helpers/seed-admin.ts
import { DataSource } from 'typeorm';
import { User } from 'database/models/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

/**
 * Adiciona um administrador dentro dos testes
 * @param {DataSource} dataSource Data Souurce para pegar o repositório de Usuário
 * @param {ConfigService} configService Serviço de configurações para pegar as variáveis ambientes
 */
export async function seedAdmin(
    dataSource: DataSource,
    configService: ConfigService,
) {
    const repo = dataSource.getRepository(User);

    const adminExists = await repo.findOne({
        where: { email: 'admin@test.com' },
    });

    if (adminExists) return;

    await repo.save({
        name: 'Admin Test',
        email: 'admin@test.com',
        password: await bcrypt.hash(
            '12345678',
            Number(configService.get('JWT_SALT_ROUNDS')),
        ),
        role: 'admin',
    });
}
