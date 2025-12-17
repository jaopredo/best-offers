import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import request from 'supertest'
import { App } from 'supertest/types'
import { Test as SupertestTest } from 'supertest'

/* REPOSITÓRIOS */
import { DataSource } from 'typeorm'

/* HELPERS */
import { getUserAuthToken, getAdminAuthToken } from './helpers/auth'
import { seedAdmin } from './helpers/seed-admin'
import e2eSetup from './e2e.setup'

describe('Font (e2e)', () => {
    let app: INestApplication<App>
    let dataSource: DataSource
    let configService: ConfigService
    let userToken: string
    let adminToken: string

    let font1: Record<string, unknown>
    let font2: Record<string, unknown>
    let font3: Record<string, unknown>

    let adapter1: Record<string, unknown>
    let adapter2: Record<string, unknown>
    let adapter3: Record<string, unknown>

    const helperAdapterBody = {
        searchURL: 'http://mock-site-1/search',
        searchParameter: 'keyword',
        sep: '%20',

        itemURLClassName: 'item-url',
        itemContainerClassName: 'item-container',
        itemNameClassName: 'item-name',
        itemPriceClassName: 'item-price',
        itemSellerClassName: 'item-seller'
    }
    const fontBody = {
        url: 'http://mock-test.foo.com',
        name: 'Foo'
    }

    const helperAdapter2Body = {
        searchURL: 'https://example-shop.com/search',
        searchParameter: 'q',
        sep: '+',

        itemURLClassName: 'product-link',
        itemContainerClassName: 'product-card',
        itemNameClassName: 'product-title',
        itemPriceClassName: 'product-price',
        itemSellerClassName: 'product-seller'
    }
    const font2Body = {
        url: 'https://store.example.com',
        name: 'Example Store'
    }

    const helperAdapter3Body = {
        searchURL: 'https://another-market.net/find',
        searchParameter: 'term',
        sep: '-',

        itemURLClassName: 'result-url',
        itemContainerClassName: 'result-item',
        itemNameClassName: 'result-name',
        itemPriceClassName: 'result-price',
        itemSellerClassName: 'result-seller'
    }
    const font3Body = {
        url: 'https://another-market.net',
        name: 'Another Market'
    }

    const userRequest = (req: SupertestTest) => req.set('Authorization', `Bearer ${userToken}`)
    const adminRequest = (req: SupertestTest) => req.set('Authorization', `Bearer ${adminToken}`)

    async function registerFontAdapter(font: Record<string, unknown>, adapter: Record<string, unknown>) {
        // Eu faço uma requisição para criar um adapter
        const { body } = await adminRequest(request(app.getHttpServer()).post('/adapter'))
            .send(adapter)
        
        // Faço outra requisição para criar uma fonte associada a esse adapter
        const res = await adminRequest(request(app.getHttpServer()).post('/font'))
            .send({
                ...font,
                adapterId: body.adapter.id
            })
        
        // Retorno um objeto tanto com a fonte quanto com o adapter
        return { font: res.body.font, adapter: body.adapter }
    }

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

        // Registrando as fontes e adapters
        const res1 = await registerFontAdapter(fontBody, helperAdapterBody)
        const res2 = await registerFontAdapter(font2Body, helperAdapter2Body)
        const res3 = await registerFontAdapter(font3Body, helperAdapter3Body)

        font1 = res1.font
        adapter1 = res1.adapter

        font2 = res2.font
        adapter2 = res2.adapter

        font3 = res3.font
        adapter3 = res3.adapter
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


    describe('(POST) /font', () => {
        it('Registra uma fonte associada a um adapter', async () => {
            // Registrando um adapter
            const { body } = await adminRequest(request(app.getHttpServer()).post('/adapter'))
                .send(helperAdapterBody)
                .expect(201)
            
            const res = await adminRequest(request(app.getHttpServer()).post('/font'))
                .send({
                    ...fontBody,
                    adapterId: body.adapter.id
                })
            
            expect(res.body).toEqual(
                expect.objectContaining({
                    message: expect.any(String),
                    font: {
                        id: expect.any(Number),
                        ...fontBody,
                        adapter: body.adapter
                    }
                })
            )
        })

        it('Tenta acessar sem token', async() => {
            const res = await request(app.getHttpServer())
                .post('/font')
                .expect(401)
            validateError(res.body, 401)
        })

        it('Tenta acessar como usuário', async () => {
            const res = await userRequest(request(app.getHttpServer()).post('/font'))
                .expect(401)
            validateError(res.body, 401)
        })

        it('Passa informações que não existem', async () => {
            const resWrongProps = await adminRequest(request(app.getHttpServer()).post('/font'))
                .send({
                    notExistingProp1: 'foo prop 1',
                    notExistingProp2: 'foo prop 2',
                })
                .expect(400)
            
            validateError(resWrongProps.body, 400)

            const resMissingFields = await adminRequest(request(app.getHttpServer()).post('/font'))
                .send(fontBody)  // Ta faltando o adapterId
                .expect(400)
            
            validateError(resMissingFields.body, 400)

            const notExistingAdapter = await adminRequest(request(app.getHttpServer()).post('/font'))
                .send({
                    ...fontBody,
                    adapterId: 200
                })
                .expect(404)
            
            validateError(notExistingAdapter.body, 404)
        })
    })

    describe('(GET) /font/:id', () => {
        it('Pegar uma fonte específica', async () => {
            const res = await userRequest(request(app.getHttpServer()).get(`/font/${font1.id}`))
                .expect(200)
            expect(res.body).toStrictEqual(font1)
        })

        it('Tenta requisição sem token', async () => {
            const res = await request(app.getHttpServer())
                .get('/font/1')
                .expect(401)
            validateError(res.body, 401)
        })

        it('Tenta pegar fonte que não existe', async () => {
            const res = await userRequest(request(app.getHttpServer()).get(`/font/200`))
                .expect(404)
            validateError(res.body, 404)
        })
    })

    describe('(GET) /font', () => {
        it('Pegar várias fontes (Com paginação)', async () => {
            const paginationInfo = {
                page: 1,
                limit: 2
            }

            // Checando a resposta do GET
            const res = await userRequest(
                request(app.getHttpServer())
                .get(`/font?page=${paginationInfo.page}&limit=${paginationInfo.limit}`)
            )
                .expect(200)
            
            expect(Array.isArray(res.body.data)).toBe(true)
            expect(res.body.data).toHaveLength(paginationInfo.limit)

            expect(res.body.meta).toEqual(
                expect.objectContaining({
                    page: paginationInfo.page,
                    limit: paginationInfo.limit,
                    total: 3,
                    totalPages: 2
                })
            )
        })

        it('Pegar várias fontes (Com banco vazio)', async () => {
            const res = await userRequest(request(app.getHttpServer()).get(`/font`))
                .query({
                    name: 'Foo'
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
                .get('/font')
                .expect(401)
            
            validateError(res.body, 401)
        })
    })

    describe('(PATCH) /font/:id', () => {
        it('Atualiza uma fonte normalmente', async () => {
            // Atualiza a fonte
            const res = await adminRequest(request(app.getHttpServer()).patch(`/font/${font1.id}`))
                .send({
                    name: 'Mock Test'
                })
                .expect(200)
            
            // Validando o corpo da requisição
            expect(res.body).toEqual(
                expect.objectContaining({
                    message: expect.any(String),
                    statusCode: 200,
                    font: {
                        ...font1,
                        name: 'Mock Test'
                    }
                })
            )

            // Validando se foi atualizado
            const getRes = await userRequest(request(app.getHttpServer()).get(`/font/${font1.id}`))
                .expect(200)
            
            expect(getRes.body).toStrictEqual({
                ...font1,
                name: 'Mock Test'
            })
        })

        it('Troca o adapter da fonte', async () => {
            // Registra um adapter substituto
            const { body: { adapter: substituteAdapter } } = await adminRequest(request(app.getHttpServer()).post('/adapter'))
                .send(helperAdapter2Body)
                .expect(201)
            
            // Atualiza a fonte
            const res = await adminRequest(request(app.getHttpServer()).patch(`/font/${font1.id}`))
                .send({
                    adapterId: substituteAdapter.id
                })
                .expect(200)
            
            // Validando o corpo da requisição
            expect(res.body).toEqual(
                expect.objectContaining({
                    message: expect.any(String),
                    statusCode: 200,
                    font: {
                        ...font1,
                        adapter: substituteAdapter
                    }
                })
            )

            // Validando se foi atualizado
            const getRes = await userRequest(request(app.getHttpServer()).get(`/font/${font1.id}`))
                .expect(200)
            
            expect(getRes.body).toStrictEqual({
                ...font1,
                adapter: substituteAdapter
            })
        })

        it('Tenta acessar sem token', async() => {
            const res = await request(app.getHttpServer())
                .patch('/font/1')
                .expect(401)
            
            validateError(res.body, 401)
        })

        it('Tenta acessar como usuário', async() => {
            const res = await userRequest(request(app.getHttpServer()).patch('/font/1'))
                .expect(401)
            
            validateError(res.body, 401)
        })

        it('Tenta atualizar fonte que não existe', async() => {
            const res = await adminRequest(request(app.getHttpServer()).patch('/font/200'))
                .expect(404)
            
            validateError(res.body, 404)
        })

        it('Passa informações que não existem', async() => {
            const unknownPropRes = await adminRequest(request(app.getHttpServer()).patch(`/font/${font1.id}`))
                .send({
                    not_exists_prop: 'Foo Value'
                })
                .expect(400)
            
            validateError(unknownPropRes.body, 400)

            const notExistingAdapterRes = await adminRequest(request(app.getHttpServer()).patch(`/font/${font1.id}`))
                .send({
                    adapterId: 2000
                })
                .expect(404)
            
            validateError(notExistingAdapterRes.body, 404)
        })
    })

    describe('(DELETE) /font/:id', () => {
        it('Deleta uma fonte', async () => {
            const res = await adminRequest(request(app.getHttpServer()).delete(`/font/${font1.id}`))
                .expect(200)

            expect(res.body).toEqual(
                expect.objectContaining({
                    message: expect.any(String),
                    statusCode: 200,
                    font: font1
                })
            )

            // Validando se deletou a fonte e o adapter
            const getFontRes = await adminRequest(request(app.getHttpServer()).get(`/font/${font1.id}`))
                .expect(404)
            validateError(getFontRes.body, 404)
        })

        it('Tenta acessar com token de usuário', async() => {
            const res = await userRequest(request(app.getHttpServer()).delete(`/font/1`))
                .expect(401)
            
            validateError(res.body, 401)
        })

        it('Tenta acessar sem token', async () => {
            const res = await request(app.getHttpServer())
                .delete(`/font/1`)
                .expect(401)
            
            validateError(res.body, 401)
        })

        it('Tenta deletar fonte que não existe', async () => {
            const res = await adminRequest(request(app.getHttpServer()).delete('/font/200'))
                .expect(404)
            
            validateError(res.body, 404)
        })
    })
})