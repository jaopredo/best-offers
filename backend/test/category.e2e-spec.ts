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

describe('Category (e2e)', () => {
    let app: INestApplication<App>
    let dataSource: DataSource
    let configService: ConfigService
    let userToken: string
    let adminToken: string

    let category1: Record<string, unknown>
    let category2: Record<string, unknown>
    let category3: Record<string, unknown>
    let category4: Record<string, unknown>

    const category1Body = {
        name: 'Categoria 1'
    }
    const category2Body = {
        name: 'Categoria 2'
    }
    const category3Body = {
        name: 'Categoria 3'
    }
    const category4Body = {
        name: 'Categoria 4'
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

        // Registrando todas as categorias
        const { body: { category: category1Res } } = await adminRequest(request(app.getHttpServer()).post('/category'))
            .send(category1Body)
            .expect(201)
        category1 = category1Res

        const { body: { category: category2Res } } = await adminRequest(request(app.getHttpServer()).post('/category'))
            .send(category2Body)
            .expect(201)
        category2 = category2Res
        
        const { body: { category: category3Res } } = await adminRequest(request(app.getHttpServer()).post('/category'))
            .send(category3Body)
            .expect(201)
        category3 = category3Res
        
        const { body: { category: category4Res } } = await adminRequest(request(app.getHttpServer()).post('/category'))
            .send(category4Body)
            .expect(201)
        category4 = category4Res
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


    describe('(POST) /category', () => {
        it('Deve registrar uma categoria', async() => {
            const categRes = await adminRequest(request(app.getHttpServer()).post('/category'))
                .send(category1Body)
                .expect(201)
            
            expect(categRes.body).toEqual(
                expect.objectContaining({
                    message: expect.any(String),
                    statusCode: 201,
                    category: {
                        id: expect.any(Number),
                        name: category1Body.name
                    }
                })
            )
        })

        it('Envia uma informação diferente do que o esperado para a rota', async() => {
            const res = await adminRequest(request(app.getHttpServer()).post('/category'))
                .send({
                    foo: 'info'
                })
                .expect(400)
            
            validateError(res.body, 400)
        })

        it('Tenta acessar a rota sem o token JWT', async() => {
            const res = await request(app.getHttpServer())
                .post('/category')
                .expect(401)
            validateError(res.body, 401)
        })

        it('Usuário comum tenta acessar a rota', async() => {
            const res = await userRequest(request(app.getHttpServer()).post('/category'))
                .expect(401)
            validateError(res.body, 401)
        })
    })

    describe('(GET) /category/:id', () => {
        it('Pegar uma categoria específica', async () => {
            const getRes = await userRequest(request(app.getHttpServer()).get(`/category/${category1.id}`))
                .expect(200)
            expect(getRes.body).toStrictEqual(category1)
        })

        it('Tenta requisição sem token', async () => {
            const res = await request(app.getHttpServer())
                .get('/category/1')
                .expect(401)
            validateError(res.body, 401)
        })

        it('Tenta pegar categoria que não existe', async () => {
            const res = await userRequest(request(app.getHttpServer()).get(`/category/200`))
                .expect(404)
            validateError(res.body, 404)
        })
    })

    describe('(GET) /category', () => {
        it('Pegar várias categorias (Com paginação)', async () => {
            const paginationInfo = {
                page: 1,
                limit: 2
            }
            
            // Checando a resposta do GET
            const res = await userRequest(
                request(app.getHttpServer())
                .get(`/category?page=${paginationInfo.page}&limit=${paginationInfo.limit}`)
            )
                .expect(200)
            
            expect(Array.isArray(res.body.data)).toBe(true)
            expect(res.body.data).toHaveLength(2)

            expect(res.body.meta).toEqual(
                expect.objectContaining({
                    page: paginationInfo.page,
                    limit: paginationInfo.limit,
                    total: 4,
                    totalPages: 2
                })
            )
        })

        it('Pegar várias categorias (Com banco vazio)', async () => {
            // Checando a resposta do GET
            const res = await userRequest(request(app.getHttpServer()).get(`/category`))
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
                .get('/category')
                .expect(401)
            
            validateError(res.body, 401)
        })
    })

    describe('(PATCH) /category/:id', () => {
        it('Atualiza uma categoria', async () => {
            const res = await adminRequest(request(app.getHttpServer()).patch(`/category/${category1.id}`))
                .send({
                    name: 'New Category Name'
                })
                .expect(200)
            
            // Validando o corpo da requisição
            expect(res.body).toEqual(
                expect.objectContaining({
                    message: expect.any(String),
                    statusCode: 200,
                    category: {
                        id: category1.id,
                        name: 'New Category Name'
                    }
                })
            )

            // Validando se foi atualizado
            const getRes = await userRequest(request(app.getHttpServer()).get(`/category/${category1.id}`))
                .expect(200)
            
            expect(getRes.body).toStrictEqual({
                id: category1.id,
                name: 'New Category Name'
            })
        })

        it('Tenta acessar sem token', async() => {
            const res = await request(app.getHttpServer())
                .patch('/category/1')
                .expect(401)
            
            validateError(res.body, 401)
        })

        it('Tenta acessar como usuário', async() => {
            const res = await userRequest(request(app.getHttpServer()).patch('/category/1'))
                .expect(401)
            
            validateError(res.body, 401)
        })

        it('Tenta atualizar categoria que não existe', async() => {
            const res = await adminRequest(request(app.getHttpServer()).patch('/category/200'))
                .expect(404)
            
            validateError(res.body, 404)
        })

        it('Passa informações que não existem', async() => {
            const res = await adminRequest(request(app.getHttpServer()).patch(`/category/${category1.id}`))
                .send({
                    not_exists_prop: 'Foo Value'
                })
                .expect(400)
            
            validateError(res.body, 400)
        })
    })

    describe('(DELETE) /category/:id', () => {
        it('Deleta uma categoria', async () => {
            const res = await adminRequest(request(app.getHttpServer()).delete(`/category/${category1.id}`))
                .expect(200)
            
            expect(res.body).toEqual(
                expect.objectContaining({
                    message: expect.any(String),
                    statusCode: 200,
                    category: category1
                })
            )

            // Validando se deletou
            const getRes = await adminRequest(request(app.getHttpServer()).get(`/category/${category1.id}`))
                .expect(404)
            validateError(getRes.body, 404)
        })

        it('Tenta acessar com token de usuário', async() => {
            const res = await userRequest(request(app.getHttpServer()).delete(`/category/1`))
                .expect(401)
            
            validateError(res.body, 401)
        })

        it('Tenta acessar sem token', async () => {
            const res = await request(app.getHttpServer())
                .delete(`/category/1`)
                .expect(401)
            
            validateError(res.body, 401)
        })

        it('Tenta deletar categoria que não existe', async () => {
            const res = await adminRequest(request(app.getHttpServer()).delete('/category/200'))
                .expect(404)
            
            validateError(res.body, 404)
        })
    })
})
