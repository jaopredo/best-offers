import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { App } from 'supertest/types'
import e2eSetup from './e2e.setup'
import { Test as SupertestTest } from 'supertest'
import { getUserAuthToken, getAdminAuthToken } from './helpers/auth'
import { seedAdmin } from './helpers/seed-admin'
import { ConfigService } from '@nestjs/config'
import { DataSource } from 'typeorm'

describe('Authentication (e2e)', () => {
    let app: INestApplication<App>
    let dataSource: DataSource
    let configService: ConfigService

    let userToken: string
    let adminToken: string

    let font: Record<string, unknown>
    let adapter: Record<string, unknown>
    let job1: Record<string, unknown>
    let job2: Record<string, unknown>
    let job3: Record<string, unknown>
    let job4: Record<string, unknown>

    let category1: Record<string, unknown>
    let category2: Record<string, unknown>

    const fontBody = {
        url: 'http://mock-test.foo.com',
        name: 'Foo'
    }
    const adapterBody = {
        searchURL: 'http://mock-site-1/search',
        searchParameter: 'keyword',
        sep: '%20',

        itemURLClassName: 'item-url',
        itemContainerClassName: 'item-container',
        itemNameClassName: 'item-name',
        itemPriceClassName: 'item-price',
        itemSellerClassName: 'item-seller'
    }

    const font2Body = {
        url: 'https://store.example.com',
        name: 'Example Store'
    }
    const adapter2Body = {
        searchURL: 'https://example-shop.com/search',
        searchParameter: 'q',
        sep: '+',

        itemURLClassName: 'product-link',
        itemContainerClassName: 'product-card',
        itemNameClassName: 'product-title',
        itemPriceClassName: 'product-price',
        itemSellerClassName: 'product-seller'
    }

    const category1Body = {
        name: 'Higiêne'
    }
    const category2Body = {
        name: 'Construção'
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
        configService = app.get<ConfigService>(ConfigService)
    })

    beforeEach(async () => {
        // Resetando todas as informações no banco de teste para realizar os testes
        // seguidamente quantas vezes eu quiser
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

        // Registrando fontes e adaptadores por padrão
        const resFontAdapterRegister = await registerFontAdapter(fontBody, adapterBody)
        font = resFontAdapterRegister.font
        adapter = resFontAdapterRegister.adapter

        // Regitrando as categorias que serão usadas nos scrapping
        const { body: { category: category1Res } } = await adminRequest(request(app.getHttpServer()).post('/category'))
            .send(category1Body)
        const { body: { category: category2Res } } = await adminRequest(request(app.getHttpServer()).post('/category'))
            .send(category2Body)
        
        // Registrando também dois jobs que serão utilizados para os testes
        // de GET, PATCH e DELETE
        const { body: { jobs: jobs1Res } } = await adminRequest(request(app.getHttpServer()).post('/scrapping'))
            .send({
                fontId: font.id
            })

        const { body: { jobs: jobs2Res } } = await adminRequest(request(app.getHttpServer()).post('/scrapping'))
            .send({
                font: font2Body,
                adapter: adapter2Body
            })
        
        job1 = jobs1Res[0]
        job2 = jobs1Res[1]
        job3 = jobs2Res[0]
        job4 = jobs2Res[1]

        category1 = category1Res
        category2 = category2Res
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
    

    afterAll(async () => {
        await app.close()
    })

    describe('(POST) /scrapping', () => {
        it('Deve mandar dois tipos de informações e fazer scrapping dos itens', async () => {
            // Mandando as informações de uma fonte que já existe
            const firstTypeRes = await adminRequest(request(app.getHttpServer()).post('/scrapping'))
                .send({
                    fontId: font.id
                })
                .expect(201)
            
            expect(firstTypeRes.body).toEqual(
                expect.objectContaining({
                    message: expect.any(String),
                    statusCode: 201,
                    jobs: [
                        {
                            id: expect.any(Number),
                            status: expect.stringMatching(/^(running|failed|success)$/),
                            font: font,
                            category: category1
                        },
                        {
                            id: expect.any(Number),
                            status: expect.stringMatching(/^(running|failed|success)$/),
                            font: font,
                            category: category2
                        }
                    ]
                })
            )

            // Mandando informações de uma fonte e de um adapter que ainda não existem
            const secondTypeRes = await adminRequest(request(app.getHttpServer()).post('/scrapping'))
                .send({
                    font: font2Body,
                    adapter: adapter2Body
                })
                .expect(201)
            
            expect(secondTypeRes.body).toEqual(
                expect.objectContaining({
                    message: expect.any(String),
                    statusCode: 201,
                    jobs: [
                        {
                            id: expect.any(Number),
                            status: expect.stringMatching(/^(running|failed|success)$/),
                            font: {
                                id: expect.any(Number),
                                ...font2Body,
                                adapter: {
                                    id: expect.any(Number),
                                    ...adapter2Body
                                }
                            },
                            category: category1
                        },
                        {
                            id: expect.any(Number),
                            status: expect.stringMatching(/^(running|failed|success)$/),
                            font: {
                                id: expect.any(Number),
                                ...font2Body,
                                adapter: {
                                    id: expect.any(Number),
                                    ...adapter2Body
                                }
                            },
                            category: category2
                        }
                    ]
                })
            )

            let font2 = secondTypeRes.body.jobs[0].font
            let adapter2 = secondTypeRes.body.jobs[0].font.adapter

            // Ele deve registrar a fonte e o adapter que foram enviados
            const getFontRes = await adminRequest(request(app.getHttpServer()).get(`/font/${font2.id}`))
            expect(getFontRes.body).toEqual(
                expect.objectContaining({
                    ...font2,
                    adapter: adapter2
                })
            )

            const getAdapterRes = await adminRequest(request(app.getHttpServer()).get(`/adapter/${adapter2.id}`))
            expect(getAdapterRes.body).toEqual(
                expect.objectContaining(adapter2)
            )
        })

        it('Tenta acessar sem token', async () => {
            const res = await request(app.getHttpServer())
                .post('/scrapping')
                .expect(401)
            validateError(res.body, 401)
        })

        it('Tenta acessar como usuário comum', async () => {
            const res = await userRequest(request(app.getHttpServer()).post('/scrapping'))
                .expect(401)
            validateError(res.body, 401)
        })

        it('Manda informações que não são esperadas', async () => {
            const resWrongProps = await adminRequest(request(app.getHttpServer()).post('/scrapping'))
                .send({
                    notExistingProp1: 'foo prop 1',
                    notExistingProp2: 'foo prop 2',
                })
                .expect(400)
            
            validateError(resWrongProps.body, 400)


            const resMissingFields = await adminRequest(request(app.getHttpServer()).post('/scrapping'))
                .send({
                    font: font
                })
                .expect(400)
            
            validateError(resMissingFields.body, 400)
        })
    })

    describe('(GET) /job/:id', () => {
        it('Deve pegar as informações de um job', async () => {
            const res = await userRequest(request(app.getHttpServer()).get(`/job/${job1.id}`))
            expect(res.body).toEqual(
                expect.objectContaining({
                    ...job1,
                    status: expect.stringMatching(/^(running|failed|success)$/)
                })
            )
        })

        it('Tenta acessar sem nenhum token', async () => {
            const res = await request(app.getHttpServer())
                .get('/job/1')
                .expect(401)
            validateError(res.body, 401)
        })

        it('Tenta pegar um job que não existe', async () => {
            const res = await userRequest(request(app.getHttpServer()).get('/job/200'))
                .expect(404)
            validateError(res.body, 404)
        })
    })

    describe('(GET) /job', () => {
        it('Pegar vários jobs (Com paginação)', async () => {
            const paginationInfo = {
                page: 1,
                limit: 2
            }
            
            // Checando a resposta do GET
            const res = await userRequest(
                request(app.getHttpServer())
                .get(`/job?page=${paginationInfo.page}&limit=${paginationInfo.limit}`)
            )
                .expect(200)
            
            expect(Array.isArray(res.body.data)).toBe(true)
            expect(res.body.data).toHaveLength(paginationInfo.limit)

            expect(res.body.meta).toEqual(
                expect.objectContaining({
                    page: paginationInfo.page,
                    limit: paginationInfo.limit,
                    total: 4,
                    totalPages: 2
                })
            )
        })

        it('Pegar vários jobs (Com pesquisa)', async () => {
            const res = await userRequest(request(app.getHttpServer()).get(`/job`))
                .query({
                    status: 'success'
                })
                .expect(200)
            
            expect(Array.isArray(res.body.data)).toBe(true)
            expect(res.body.data).toHaveLength(4)

            expect(res.body.meta).toEqual(
                expect.objectContaining({
                    page: 1,
                    limit: 10,
                    total: 4,
                    totalPages: 1
                })
            )
        })

        it('Tenta pegar sem passar um token', async () => {
            const res = await request(app.getHttpServer())
                .get('/job')
                .expect(401)
            
            validateError(res.body, 401)
        })
    })

    describe('(DELETE) /job/:id', () => {
        it('Deleta um job', async () => {
            const res = await adminRequest(request(app.getHttpServer()).delete(`/job/${job1.id}`))
                .expect(200)
            expect(res.body).toEqual(
                expect.objectContaining({
                    message: expect.any(String),
                    statusCode: 200,
                    job: job1
                })
            )

            // Validando que deletou o job do banco
            const getRes = await adminRequest(request(app.getHttpServer()).get(`/job/${job1.id}`))
                .expect(404)
            validateError(getRes.body, 404)
        })

        it('Tenta deletar um job que não existe', async () => {
            const res = await adminRequest(request(app.getHttpServer()).delete('/job/200'))
                .expect(404)
            validateError(res.body, 404)
        })

        it('Tenta acessar como usuário', async () => {
            const res = await userRequest(request(app.getHttpServer()).delete('/job/1'))
                .expect(404)
            validateError(res.body, 404)
        })

        it('Tenta acessar sem token', async () => {
            const res = await request(app.getHttpServer())
                .delete('/job/1')
                .expect(404)
            validateError(res.body, 404)
        })
    })
})