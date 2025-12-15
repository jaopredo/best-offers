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
import e2eSetup from './e2e.setup'

describe('Font (e2e)', () => {
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

    const userRequest = (req) => req.set('Authorization', `Bearer ${userToken}`)
    const adminRequest = (req) => req.set('Authorization', `Bearer ${adminToken}`)

    // O primeiro passa o `searchParameter` como parâmetro da Query
    const helperAdapter = {
        searchURL: 'http://mock-site-1/search',
        searchParameter: 'keyword',
        sep: '%20',

        itemURLClassName: 'item-url',
        itemContainerClassName: 'item-container',
        itemNameClassName: 'item-name',
        itemPriceClassName: 'item-price',
        itemSellerClassName: 'item-seller'
    }

    const font = {
        url: 'http://mock-test.foo.com',
        name: 'Foo'
    }

    const helperAdapter2 = {
        searchURL: 'https://example-shop.com/search',
        searchParameter: 'q',
        sep: '+',

        itemURLClassName: 'product-link',
        itemContainerClassName: 'product-card',
        itemNameClassName: 'product-title',
        itemPriceClassName: 'product-price',
        itemSellerClassName: 'product-seller'
    }

    const font2 = {
        url: 'https://store.example.com',
        name: 'Example Store'
    }

    const helperAdapter3 = {
        searchURL: 'https://another-market.net/find',
        searchParameter: 'term',
        sep: '-',

        itemURLClassName: 'result-url',
        itemContainerClassName: 'result-item',
        itemNameClassName: 'result-name',
        itemPriceClassName: 'result-price',
        itemSellerClassName: 'result-seller'
    }

    const font3 = {
        url: 'https://another-market.net',
        name: 'Another Market'
    }


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



    describe('(POST) /font', () => {
        it('Registra uma fonte associada a um adapter', async () => {
            // Registrando um adapter
            const { body } = await adminRequest(request(app.getHttpServer()).post('/adapter'))
                .send(helperAdapter)
                .expect(201)
            
            const res = await adminRequest(request(app.getHttpServer()).post('/font'))
                .send({
                    ...font,
                    adapterId: body.adapter.id
                })
            
            expect(res.body).toEqual(
                expect.objectContaining({
                    message: expect.any(String),
                    font: {
                        id: expect.any(Number),
                        ...font,
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
                .send(font)  // Ta faltando o adapterId
                .expect(400)
            
            validateError(resMissingFields.body, 400)

            const notExistingAdapter = await adminRequest(request(app.getHttpServer()).post('/font'))
                .send({
                    ...font,
                    adapterId: 200
                })
                .expect(404)
            
            validateError(notExistingAdapter.body, 404)
        })
    })

    describe('(GET) /font/:id', () => {
        it('Pegar uma fonte específica', async () => {
            // Registrando um adapter
            const res = await registerFontAdapter(font, helperAdapter)
            
            const get_res = await userRequest(request(app.getHttpServer()).get(`/font/${res.font.id}`))
                .expect(200)
            expect(get_res.body).toStrictEqual({
                ...res.font,
                adapter: res.adapter
            })
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
            
            // Registrando todos os adapters e fontes
            let adapters = [helperAdapter, helperAdapter2, helperAdapter3]
            let fonts = [font, font2, font3]
            let registeredAdapters: Record<string, unknown>[] = []
            let registeredFonts: Record<string, unknown>[] = []
            for (let i = 0; i < fonts.length; i++) {
                const regisRes = await registerFontAdapter(fonts[i], adapters[i])
                registeredAdapters.push(regisRes.adapter)
                registeredFonts.push(regisRes.font)
            }
            
            // Checando a resposta do GET
            const res = await userRequest(
                request(app.getHttpServer())
                .get(`/font?page=${paginationInfo.page}&limit=${paginationInfo.limit}`)
            )
                .expect(200)
            
            expect(Array.isArray(res.body.data)).toBe(true)
            expect(res.body.data).toHaveLength(2)

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
                .expect(200)
            
            expect(Array.isArray(res.body.data)).toBe(true)
            expect(res.body.data).toEqual([])

            expect(res.body.meta).toEqual(
                expect.objectContaining({
                    page: 1,
                    limit: 10,
                    total: 0,
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
            const regisRes = await registerFontAdapter(font, helperAdapter)
            
            // Atualiza a fonte
            const res = await adminRequest(request(app.getHttpServer()).patch(`/font/${regisRes.font.id}`))
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
                        ...regisRes.font,
                        name: 'Mock Test'
                    }
                })
            )

            // Validando se foi atualizado
            const get_res = await userRequest(request(app.getHttpServer()).get(`/font/${regisRes.font.id}`))
                .expect(200)
            
            expect(get_res.body).toStrictEqual({
                ...regisRes.font,
                name: 'Mock Test'
            })
        })

        it('Troca o adapter da fonte', async () => {
            // Registra a fonte junto de um adapter e um adapter separado
            const regisRes = await registerFontAdapter(font, helperAdapter)
            const { body: { adapter: substituteAdapter } } = await adminRequest(request(app.getHttpServer()).post('/adapter'))
                .send(helperAdapter2)
                .expect(201)
            
            // Atualiza a fonte
            const res = await adminRequest(request(app.getHttpServer()).patch(`/font/${regisRes.font.id}`))
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
                        ...regisRes.font,
                        adapter: substituteAdapter
                    }
                })
            )

            // Validando se foi atualizado
            const get_res = await userRequest(request(app.getHttpServer()).get(`/font/${regisRes.adapter.id}`))
                .expect(200)
            
            expect(get_res.body).toStrictEqual({
                ...regisRes.font,
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
            const regisRes = await registerFontAdapter(font, helperAdapter)
            
            const unknownPropRes = await adminRequest(request(app.getHttpServer()).patch(`/font/${regisRes.font.id}`))
                .send({
                    not_exists_prop: 'Foo Value'
                })
                .expect(400)
            
            validateError(unknownPropRes.body, 400)

            const notExistingAdapterRes = await adminRequest(request(app.getHttpServer()).patch(`/font/${regisRes.font.id}`))
                .send({
                    adapterId: 2000
                })
                .expect(404)
            
            validateError(notExistingAdapterRes.body, 404)
        })
    })

    describe('(DELETE) /font/:id', () => {
        it('Deleta uma fonte', async () => {
            const regisRes = await registerFontAdapter(font, helperAdapter)
            
            const res = await adminRequest(request(app.getHttpServer()).delete(`/adapter/${regisRes.font.id}`))
                .expect(200)
            
            expect(res.body).toEqual(
                expect.objectContaining({
                    message: expect.any(String),
                    statusCode: 200,
                    font: regisRes.font
                })
            )

            // Validando se deletou a fonte e o adapter
            const getFontRes = await adminRequest(request(app.getHttpServer()).get(`/font/${regisRes.font.id}`))
                .validate(404)
            validateError(getFontRes.body, 404)

            const getAdapterRes = await adminRequest(request(app.getHttpServer()).get(`/adapter/${regisRes.adapter.id}`))
                .validate(404)
            validateError(getAdapterRes.body, 404)
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