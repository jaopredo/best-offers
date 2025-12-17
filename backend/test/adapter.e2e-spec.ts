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

    let adapter1: Record<string, unknown>
    let adapter2: Record<string, unknown>

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

    const userRequest = (req: SupertestTest) => req.set('Authorization', `Bearer ${userToken}`)
    const adminRequest = (req: SupertestTest) => req.set('Authorization', `Bearer ${adminToken}`)

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

        const { body: { adapter: adapter1Res } } = await adminRequest(request(app.getHttpServer()).post('/adapter'))
            .send(firstTypeAdapter)
            .expect(201)
        adapter1 = adapter1Res

        const { body: { adapter: adapter2Res } } = await adminRequest(request(app.getHttpServer()).post('/adapter'))
            .send(secondTypeAdapter)
            .expect(201)
        adapter2 = adapter2Res
    })

    afterAll(async () => {
        await app.close()
    })

    const validateError = (value: Record<string,unknown>, code: number) => {
        expect(value).toEqual(
            expect.objectContaining({
                message: expect.anything(),
                error: expect.any(String),
                statusCode: code
            })
        )

        expect(
            typeof value.message === 'string' || Array.isArray(value.message)
        ).toBe(true)
    }

    
    describe('(POST) /adapter', () => {
        it('Registra vários tipos de adapter', async () => {
            const resFirstAdapter = await adminRequest(request(app.getHttpServer()).post('/adapter'))
                .send(firstTypeAdapter)
                .expect(201)
            
            expect(resFirstAdapter.body).toEqual(
                expect.objectContaining({
                    message: expect.any(String),
                    statusCode: 201,
                    adapter: {
                        id: expect.any(Number),
                        ...firstTypeAdapter
                    }
                })
            )

            const resSecondAdapter = await adminRequest(request(app.getHttpServer()).post('/adapter'))
                .send(secondTypeAdapter)
                .expect(201)
            
            expect(resSecondAdapter.body).toEqual(
                expect.objectContaining({
                    message: expect.any(String),
                    statusCode: 201,
                    adapter: {
                        id: expect.any(Number),
                        ...secondTypeAdapter,
                        searchParameter: null
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

        it('Passa informações que não existem', async () => {
            const resWrongProps = await adminRequest(request(app.getHttpServer()).post('/adapter'))
                .send({
                    notExistingProp1: 'foo prop 1',
                    notExistingProp2: 'foo prop 2',
                })
                .expect(400)
            
            validateError(resWrongProps.body, 400)


            const resMissingFields = await adminRequest(request(app.getHttpServer()).post('/adapter'))
                .send({
                    ...firstTypeAdapter,
                    itemURLClassName: undefined,
                    itemContainerClassName: undefined,
                })
                .expect(400)
            
            validateError(resMissingFields.body, 400)
        })
    })

    describe('(GET) /adapter/:id', () => {
        it('Pegar um adapter específica', async () => {
            const res = await userRequest(request(app.getHttpServer()).get(`/adapter/${adapter1.id}`))
                .expect(200)
            expect(res.body).toStrictEqual(adapter1)
        })

        it('Tenta requisição sem token', async () => {
            const res = await request(app.getHttpServer())
                .get('/adapter/1')
                .expect(401)
            validateError(res.body, 401)
        })

        it('Tenta pegar adapter que não existe', async () => {
            const res = await userRequest(request(app.getHttpServer()).get(`/adapter/200`))
                .expect(404)
            validateError(res.body, 404)
        })
    })

    describe('(GET) /adapter', () => {
        it('Pegar vários adapters (Com paginação)', async () => {
            const paginationInfo = {
                page: 1,
                limit: 1
            }
            
            // Checando a resposta do GET
            const res = await userRequest(
                request(app.getHttpServer())
                .get(`/adapter?page=${paginationInfo.page}&limit=${paginationInfo.limit}`)
            )
                .expect(200)
            
            expect(Array.isArray(res.body.data)).toBe(true)
            expect(res.body.data).toHaveLength(paginationInfo.limit)

            expect(res.body.meta).toEqual(
                expect.objectContaining({
                    page: paginationInfo.page,
                    limit: paginationInfo.limit,
                    total: 2,
                    totalPages: 2
                })
            )
        })

        it('Pegar vários adapters (Com informações de pesquisa)', async () => {
            const res = await userRequest(request(app.getHttpServer()).get(`/adapter`))
                .query({
                    sep: '+'
                })
                .expect(200)
            
            expect(Array.isArray(res.body.data)).toBe(true)
            expect(res.body.data).toHaveLength(1)

            expect(res.body.meta).toEqual(
                expect.objectContaining({
                    page: 1,
                    limit: 10,
                    total: 1,
                    totalPages: 1
                })
            )
        })

        it('Tenta pegar sem passar um token', async () => {
            const res = await request(app.getHttpServer())
                .get('/adapter')
                .expect(401)
            
            validateError(res.body, 401)
        })
    })

    describe('(PATCH) /adapter/:id', () => {
        it('Atualiza um adapter', async () => {
            const res = await adminRequest(request(app.getHttpServer()).patch(`/adapter/${adapter1.id}`))
                .send({
                    sep: 'test-sep'
                })
                .expect(200)
            
            // Validando o corpo da requisição
            expect(res.body).toEqual(
                expect.objectContaining({
                    message: expect.any(String),
                    statusCode: 200,
                    adapter: {
                        ...adapter1,
                        sep: 'test-sep'
                    }
                })
            )

            // Validando se foi atualizado
            const getRes = await userRequest(request(app.getHttpServer()).get(`/adapter/${adapter1.id}`))
                .expect(200)
            
            expect(getRes.body).toStrictEqual({
                ...adapter1,
                sep: 'test-sep'
            })
        })

        it('Tenta acessar sem token', async() => {
            const res = await request(app.getHttpServer())
                .patch('/adapter/1')
                .expect(401)
            
            validateError(res.body, 401)
        })

        it('Tenta acessar como usuário', async() => {
            const res = await userRequest(request(app.getHttpServer()).patch('/adapter/1'))
                .expect(401)
            
            validateError(res.body, 401)
        })

        it('Tenta atualizar adapter que não existe', async() => {
            const res = await adminRequest(request(app.getHttpServer()).patch('/adapter/200'))
                .expect(404)
            
            validateError(res.body, 404)
        })

        it('Passa informações que não existem', async() => {
            const res = await adminRequest(request(app.getHttpServer()).patch(`/adapter/${adapter1.id}`))
                .send({
                    not_exists_prop: 'Foo Value'
                })
                .expect(400)
            
            validateError(res.body, 400)
        })
    })

    describe('(DELETE) /adapter/:id', () => {
        it('Deleta um adapter', async () => {
            const res = await adminRequest(request(app.getHttpServer()).delete(`/adapter/${adapter1.id}`))
                .expect(200)
            
            expect(res.body).toEqual(
                expect.objectContaining({
                    message: expect.any(String),
                    statusCode: 200,
                    adapter: adapter1
                })
            )

            // Validando se deletou o personagem
            const getRes = await adminRequest(request(app.getHttpServer()).get(`/adapter/${adapter1.id}`))
                .expect(404)
            validateError(getRes.body, 404)
        })

        it('Tenta acessar com token de usuário', async() => {
            const res = await userRequest(request(app.getHttpServer()).delete(`/adapter/1`))
                .expect(401)
            
            validateError(res.body, 401)
        })

        it('Tenta acessar sem token', async () => {
            const res = await request(app.getHttpServer())
                .delete(`/adapter/1`)
                .expect(401)
            
            validateError(res.body, 401)
        })

        it('Tenta deletar adapter que não existe', async () => {
            const res = await adminRequest(request(app.getHttpServer()).delete('/adapter/200'))
                .expect(404)
            
            validateError(res.body, 404)
        })
    })
})