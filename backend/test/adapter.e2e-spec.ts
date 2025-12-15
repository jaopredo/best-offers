import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import request from 'supertest'
import { App } from 'supertest/types'
import { AppModule } from '../src/app.module'

/* REPOSITÓRIOS */
import { DataSource } from 'typeorm'

/* HELPERS */
import { getUserAuthToken, getAdminAuthToken } from './helpers/auth'
import { seedAdmin } from './helpers/seed-admin'

describe('Adapter (e2e)', () => {
    let app: INestApplication<App>
    let dataSource: DataSource
    let configService: ConfigService
    let userToken: string
    let adminToken: string

    beforeAll(async () => {
        // Inicializando o aplicativo
        const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
            ConfigModule.forRoot({
                envFilePath: ['.env.test.local'],
            }),
            AppModule
        ],
        }).compile()

        app = moduleFixture.createNestApplication()

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
                transformOptions: {
                    enableImplicitConversion: true,
                },
            })
        )

        await app.init()

        configService = app.get(ConfigService)

        dataSource = app.get(DataSource)
        
        await dataSource.synchronize()
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

    const userRequest = (req) => req.set('Authorization', `Bearer ${userToken}`)
    const adminRequest = (req) => req.set('Authorization', `Bearer ${adminToken}`)

    // O primeiro passa o `searchParameter` como parâmetro da Query
    const firstTypeAdapter = {
        searchURL: 'http://mock-site-1/search',
        searchParameter: 'keyword',
        sep: '%20',

        itemURLClassName: 'item-url',
        itemContainerClassName: 'item-container',
        itemNameClassName: 'item-name',
        itemPriceClassName: 'item-price',
        itemSellerClassName: 'item-seller'
    }

    // O segundo passa a categoria na própria URL (Algo tipo `/searchURL/:category`)
    const secondTypeAdapter = {
        searchURL: 'http://mock-site-2/search/',
        sep: '+',

        itemURLClassName: 'item-url',
        itemContainerClassName: 'item-container',
        itemNameClassName: 'item-name',
        itemPriceClassName: 'item-price',
        itemSellerClassName: 'item-seller'
    }

    describe('(POST) /adapter', () => {
        it('Registra vários tipos de adapter', async () => {
            const resFirstAdapter = await adminRequest(request(app.getHttpServer()).post('/adapter'))
                .send(firstTypeAdapter)
                .expect(201)
            
            expect(resFirstAdapter.body).toEqual(
                expect.objectContaining({
                    message: expect.any(String),
                    adapter: {
                        id: expect.any(Number),
                        ...firstTypeAdapter
                    }
                })
            )


            const resSecondAdapter = await adminRequest(request(app.getHttpServer()).post('/adapter'))
                .send(secondTypeAdapter)
                .expect(201)
            
            expect(resSecondAdapter).toEqual(
                expect.objectContaining({
                    message: expect.any(String),
                    adapter: {
                        id: expect.any(Number),
                        ...secondTypeAdapter
                    }
                })
            )
        })

        it('Tenta acessar sem token', async() => {
            const res = await request(app.getHttpServer())
                .post('/adapter')
                .expect(401)
            validateError(res.body, 401)
        })

        it('Tenta acessar como usuário', async () => {
            const res = await userRequest(request(app.getHttpServer()).post('/adapter'))
                .expect(401)
            validateError(res.body, 401)
        })

        
    })
})