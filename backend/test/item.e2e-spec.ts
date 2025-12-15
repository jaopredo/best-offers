import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import request from 'supertest'
import { Test as SupertestTest } from 'supertest'
import { App } from 'supertest/types'

/* REPOSITÓRIOS */
import { DataSource } from 'typeorm'

/* HELPERS */
import { getUserAuthToken, getAdminAuthToken } from './helpers/auth'
import { seedAdmin } from './helpers/seed-admin'
import e2eSetup from './e2e.setup'

describe('Adapter (e2e)', () => {
    let app: INestApplication<App>
    let dataSource: DataSource
    let configService: ConfigService
    let userToken: string
    let adminToken: string

    beforeAll(async () => {
        const setup = await e2eSetup()
        app = setup.app
        dataSource = setup.dataSource
        configService = app.get(ConfigService)
    })

    beforeEach(async () => {
        // Resetando todas as informações no banco de teste para realizar os testes
        // seguidamente quantas vezes eu quiser
        dataSource = app.get<DataSource>(DataSource)
        const tableNames = dataSource.entityMetadatas
            .map(entity => `"${entity.tableName}"`)
            .join(', ')

        await dataSource.query(
            `TRUNCATE ${tableNames} RESTART IDENTITY CASCADE`
        )

        // Pegando um token para usuário e para administrador
        userToken = await getUserAuthToken(app.getHttpServer())
        await seedAdmin(dataSource, configService)
        adminToken = await getAdminAuthToken(app.getHttpServer())
    })

    afterAll(async () => {
        await app.close()
    })

    const validateError = (value: unknown, code: number) => {
        expect(value).toEqual(
            expect.objectContaining({
                message: expect.any(String),
                error: expect.any(String),
                statusCode: code
            })
        )
    }

    const userRequest = (req: SupertestTest) => req.set('Authorization', `Bearer ${userToken}`)
    const adminRequest = (req: SupertestTest) => req.set('Authorization', `Bearer ${adminToken}`)
})