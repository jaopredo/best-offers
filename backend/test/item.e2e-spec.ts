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

describe('Item (e2e)', () => {
    let app: INestApplication<App>
    let dataSource: DataSource
    let configService: ConfigService
    let userToken: string
    let adminToken: string

    let category: Record<string, unknown>
    let font: Record<string, unknown>
    let adapter: Record<string, unknown>
    let item: Record<string, unknown>

    let category2: Record<string, unknown>
    let font2: Record<string, unknown>
    let adapter2: Record<string, unknown>
    let item2: Record<string, unknown>


    /* OBJETOS QUE SERÃO UTILIZADOS DURANTE OS TESTES */
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
    const fontBody = {
        url: 'http://mock-test.foo.com',
        name: 'Foo'
    }
    const categoryBody = {
        name: 'Foo Category'
    }
    const itemBody = {
        name: "Kit de chaves de fenda",
        price: 32.84,
        url: "http://foo.com.br/kit-chave-de-fenda",
        seller: "Vendedor",
    }

    const adapterBody2 = {
        searchURL: 'http://mock-site-2/search',
        searchParameter: 'q',
        sep: '+',

        itemURLClassName: 'product-link',
        itemContainerClassName: 'product-card',
        itemNameClassName: 'product-title',
        itemPriceClassName: 'product-price',
        itemSellerClassName: 'product-seller'
    }
    const fontBody2 = {
        url: 'http://mock-test.bar.com',
        name: 'Bar'
    }
    const categoryBody2 = {
        name: 'Bar Category'
    }
    const itemBody2 = {
        name: "Papel Higiênico",
        price: 9.10,
        url: "http://mock-test.bar.com/papel+higienico",
        seller: "Vendedor",
    }

    /* HELPERS PARA SETAR TOKENS NAS REQUESTS */
    const userRequest = (req: SupertestTest) => req.set('Authorization', `Bearer ${userToken}`)
    const adminRequest = (req: SupertestTest) => req.set('Authorization', `Bearer ${adminToken}`)

    /**
     * Recebe uma categoria, uma fonte e um adapter e registra no banco de dados
     * @param category Categoria a ser registrada
     * @param item Item a ser registrado
     * @param font Fonte a ser registrada
     * @param adapter Adapter a ser registrado
     * @returns Retorna um objeto contendo cada objeto retornado pelas requisições
     */
    async function registerItemCategoryFontAdapter(
        item: Record<string, unknown>,
        category: Record<string, unknown>,
        font: Record<string, unknown>,
        adapter: Record<string, unknown>
    ) {
        // Eu faço uma requisição para criar um adapter
        const { body: { adapter: resAdapter } } = await adminRequest(request(app.getHttpServer()).post('/adapter'))
            .send(adapter)
        
        // Faço outra requisição para criar uma fonte associada a esse adapter
        const { body: { font: resFont } } = await adminRequest(request(app.getHttpServer()).post('/font'))
            .send({
                ...font,
                adapterId: resAdapter.id
            })
        
        // Faço o registro de uma categoria
        const { body: { category: resCategory } } = await adminRequest(request(app.getHttpServer()).post('/category'))
            .send(category)
        
        // Registrando o item
        const { body: { item: resItem } } = await adminRequest(request(app.getHttpServer()).post('/item'))
            .send({
                ...item,
                fontId: resFont.id,
                categoryId: resCategory.id
            })
        
        // Retorno um objeto tanto com a fonte quanto com o adapter
        return { font: resFont, category: resCategory, adapter: resAdapter, item: resItem }
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

        /* PADRÃO */
        /**
         * Antes de todo teste, vou iniciar uma categoria, uma fonte e um adapter
         */
        const registeredItemsResponse1 = await registerItemCategoryFontAdapter(
            itemBody,
            categoryBody,
            fontBody,
            adapterBody
        )
        const registeredItemsResponse2 = await registerItemCategoryFontAdapter(
            itemBody2,
            categoryBody2,
            fontBody2,
            adapterBody2
        )

        category = registeredItemsResponse1.category
        font = registeredItemsResponse1.font
        adapter = registeredItemsResponse1.adapter
        item = registeredItemsResponse1.item

        category2 = registeredItemsResponse2.category
        font2 = registeredItemsResponse2.font
        adapter2 = registeredItemsResponse2.adapter
        item2 = registeredItemsResponse2.item
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

    describe('(POST) /item', () => {
        it('Registra um item', async () => {
            // Registrando o item
            const res = await adminRequest(request(app.getHttpServer()).post('/item'))
                .send({
                    ...itemBody,
                    fontId: font.id,
                    categoryId: category.id
                })
                .expect(201)
            
            let fontResponse = {
                ...font
            }
            delete fontResponse.adapter
            
            expect(res.body).toEqual(
                expect.objectContaining({
                    message: expect.any(String),
                    statusCode: 201,
                    item: {
                        id: expect.any(Number),
                        ...itemBody,
                        font: {
                            ...fontResponse,
                        },
                        category: category
                    }
                })
            )
        })

        it('Tenta acessar sem token', async () => {
            const res = await request(app.getHttpServer())
                .post('/item')
                .expect(401)
            validateError(res.body, 401)
        })
        
        it('Tenta logar como usuário', async () => {
            const res = await userRequest(request(app.getHttpServer()).post('/item'))
                .expect(401)
            validateError(res.body, 401)
        })

        it('Tenta registrar um item com informações não permitidas', async () => {
            const missingArgumentsRes = await adminRequest(request(app.getHttpServer()).post('/item'))
                .send({
                    fooInfo: 'Bad Arguments Foo'
                })
                .expect(400)
            
            validateError(missingArgumentsRes.body, 400)

            const extraArgumentsRes = await adminRequest(request(app.getHttpServer()).post('/item'))
                .send({
                    ...itemBody,
                    categoryId: category.id,
                    fontId: font.id,
                    fooArgument: 'Bad Argument >:('
                })
                .expect(400)
            
            validateError(extraArgumentsRes.body, 400)
        })

        it('Tenta registrar um item com uma categoria que não existe', async () => {
            // Registrando o item
            const res = await adminRequest(request(app.getHttpServer()).post('/item'))
                .send({
                    ...itemBody,
                    fontId: font.id,
                    categoryId: 300
                })
                .expect(404)
            validateError(res.body, 404)
        })

        it('Tenta registrar um item com uma fonte que não existe', async () => {
            // Registrando o item
            const res = await adminRequest(request(app.getHttpServer()).post('/item'))
                .send({
                    ...itemBody,
                    fontId: 300,
                    categoryId: category.id
                })
                .expect(404)
            validateError(res.body, 404)
        })
    })

    describe('(GET) /item/:id', () => {
        it('Pegar um item específico', async () => {
            const get_res = await userRequest(request(app.getHttpServer()).get(`/item/${item.id}`))
                .expect(200)
            expect(get_res.body).toStrictEqual(item)
        })

        it('Tenta requisição sem token', async () => {
            const res = await request(app.getHttpServer())
                .get('/category/1')
                .expect(401)
            validateError(res.body, 401)
        })

        it('Tenta pegar item que não existe', async () => {
            const res = await userRequest(request(app.getHttpServer()).get(`/item/200`))
                .expect(404)
            validateError(res.body, 404)
        })
    })

    describe('(GET) /item', () => {
        it('Pegar vários itens (Com paginação)', async () => {
            const paginationInfo = {
                page: 1,
                limit: 2
            }
            
            // Checando a resposta do GET
            const res = await userRequest(
                request(app.getHttpServer())
                .get(`/item?page=${paginationInfo.page}&limit=${paginationInfo.limit}`)
            )
                .expect(200)
            
            expect(Array.isArray(res.body.data)).toBe(true)
            expect(res.body.data).toHaveLength(paginationInfo.limit)

            expect(res.body.meta).toEqual(
                expect.objectContaining({
                    page: paginationInfo.page,
                    limit: paginationInfo.limit,
                    total: 2,
                    totalPages: 1
                })
            )
        })

        it('Pegar vários itens (Com pesquisa)', async () => {
            // Checando a resposta do GET
            const res = await userRequest(request(app.getHttpServer()).get(`/item`))
                .query({
                    name: 'Papel'
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
                .get('/item')
                .expect(401)
            
            validateError(res.body, 401)
        })
    })

    describe('(PATCH) /item', () => {
        it('Atualiza um item normalmente', async () => {
            // Atualiza a fonte
            const res = await adminRequest(request(app.getHttpServer()).patch(`/item/${item.id}`))
                .send({
                    name: 'Mock Item'
                })
                .expect(200)
            
            // Validando o corpo da requisição
            expect(res.body).toEqual(
                expect.objectContaining({
                    message: expect.any(String),
                    statusCode: 200,
                    item: {
                        ...item,
                        name: 'Mock Item'
                    }
                })
            )

            // Validando se foi atualizado
            const get_res = await userRequest(request(app.getHttpServer()).get(`/item/${item.id}`))
                .expect(200)
            
            expect(get_res.body).toStrictEqual({
                ...item,
                name: 'Mock Test'
            })
        })

        it('Troca a fonte do item', async () => {
            // Atualiza a fonte do item
            const res = await adminRequest(request(app.getHttpServer()).patch(`/item/${item.id}`))
                .send({
                    fontId: font2.id
                })
                .expect(200)
            
            // Validando o corpo da requisição
            expect(res.body).toEqual(
                expect.objectContaining({
                    message: expect.any(String),
                    statusCode: 200,
                    item: {
                        ...item,
                        font: {
                            ...font2,
                            adapter: undefined
                        }
                    }
                })
            )

            // Validando se foi atualizado
            const getRes = await userRequest(request(app.getHttpServer()).get(`/item/${item.id}`))
                .expect(200)
            
            expect(getRes.body).toStrictEqual({
                ...item,
                font: {
                    ...font2,
                    adapter: undefined
                }
            })
        })

        it('Troca a categoria do item', async () => {
            // Atualiza a fonte do item
            const res = await adminRequest(request(app.getHttpServer()).patch(`/item/${item.id}`))
                .send({
                    categoryId: category2.id
                })
                .expect(200)
            
            // Validando o corpo da requisição
            expect(res.body).toEqual(
                expect.objectContaining({
                    message: expect.any(String),
                    statusCode: 200,
                    item: {
                        ...item,
                        category: category2
                    }
                })
            )

            // Validando se foi atualizado
            const getRes = await userRequest(request(app.getHttpServer()).get(`/item/${item.id}`))
                .expect(200)
            
            expect(getRes.body).toStrictEqual({
                ...item,
                category: category2
            })
        })

        it('Tenta acessar sem token', async() => {
            const res = await request(app.getHttpServer())
                .patch('/item/1')
                .expect(401)
            
            validateError(res.body, 401)
        })

        it('Tenta acessar como usuário', async() => {
            const res = await userRequest(request(app.getHttpServer()).patch('/item/1'))
                .expect(401)
            
            validateError(res.body, 401)
        })

        it('Tenta atualizar item que não existe', async() => {
            const res = await adminRequest(request(app.getHttpServer()).patch('/item/200'))
                .expect(404)
            
            validateError(res.body, 404)
        })

        it('Passa informações que não existem', async() => {
            const unknownPropRes = await adminRequest(request(app.getHttpServer()).patch(`/item/${item.id}`))
                .send({
                    not_exists_prop: 'Foo Value'
                })
                .expect(400)
            
            validateError(unknownPropRes.body, 400)

            const notExistingCategoryRes = await adminRequest(request(app.getHttpServer()).patch(`/item/${item.id}`))
                .send({
                    categoryId: 2000
                })
                .expect(404)
            
            validateError(notExistingCategoryRes.body, 404)

            const notExistingFontRes = await adminRequest(request(app.getHttpServer()).patch(`/item/${item.id}`))
                .send({
                    fontId: 2000
                })
                .expect(404)
            
            validateError(notExistingFontRes.body, 404)
        })
    })

    describe('(DELETE) /item/:id', () => {
        it('Deleta um item', async () => {
            const res = await adminRequest(request(app.getHttpServer()).delete(`/item/${item.id}`))
                .expect(200)
            
            expect(res.body).toEqual(
                expect.objectContaining({
                    message: expect.any(String),
                    statusCode: 200,
                    item
                })
            )

            // Validando se deletou a fonte e o adapter
            const getItemRes = await adminRequest(request(app.getHttpServer()).get(`/item/${item.id}`))
                .expect(404)
            validateError(getItemRes.body, 404)
        })

        it('Tenta acessar com token de usuário', async() => {
            const res = await userRequest(request(app.getHttpServer()).delete(`/item/1`))
                .expect(401)
            
            validateError(res.body, 401)
        })

        it('Tenta acessar sem token', async () => {
            const res = await request(app.getHttpServer())
                .delete(`/item/1`)
                .expect(401)
            
            validateError(res.body, 401)
        })

        it('Tenta deletar item que não existe', async () => {
            const res = await adminRequest(request(app.getHttpServer()).delete('/item/200'))
                .expect(404)
            
            validateError(res.body, 404)
        })
    })
})