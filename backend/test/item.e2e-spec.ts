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

    /* HELPERS PARA SETAR TOKENS NAS REQUESTS */
    const userRequest = (req: SupertestTest) => req.set('Authorization', `Bearer ${userToken}`)
    const adminRequest = (req: SupertestTest) => req.set('Authorization', `Bearer ${adminToken}`)

    /**
     * Recebe uma categoria, uma fonte e um adapter e registra no banco de dados
     * @param category Categoria a ser registrada
     * @param font Fonte a ser registrada
     * @param adapter Adapter a ser registrado
     * @returns Retorna um objeto contendo cada objeto retornado pelas requisições
     */
    async function registerCategoryFontAdapter(
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
        
        // Retorno um objeto tanto com a fonte quanto com o adapter
        return { font: resFont, category: resCategory, adapter: resAdapter }
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
        const registeredItemsResponse = await registerCategoryFontAdapter(
            categoryBody,
            fontBody,
            adapterBody
        )

        category = registeredItemsResponse.category
        font = registeredItemsResponse.font
        adapter = registeredItemsResponse.adapter
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
            
            expect(res.body).toEqual(
                expect.objectContaining({
                    message: expect.any(String),
                    statusCode: 201,
                    item: {
                        ...itemBody,
                        font: {
                            ...font,
                            adapter: undefined  // Eu não quero retornar o adaptador da fonte dentro da response do item
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
})