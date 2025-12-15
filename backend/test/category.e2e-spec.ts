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
    })

    afterAll(async () => {
        await app.close()
    })

    const category1 = {
        name: 'Categoria 1'
    }
    const category2 = {
        name: 'Categoria 2'
    }
    const category3 = {
        name: 'Categoria 3'
    }
    const category4 = {
        name: 'Categoria 4'
    }

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


    describe('(POST) /category', () => {
        it('Deve registrar duas categorias distintas', async() => {
            const categ1_res = await adminRequest(request(app.getHttpServer()).post('/category'))
                .send(category1)
                .expect(201)
            
            expect(categ1_res.body).toEqual(
                expect.objectContaining({
                    message: expect.any(String),
                    statusCode: 201,
                    category: {
                        id: expect.any(Number),
                        name: category1.name
                    }
                })
            )

            const categ2_res = await adminRequest(request(app.getHttpServer()).post('/category'))
                .send(category2)
                .expect(201)
            
            expect(categ2_res.body).toEqual(
                expect.objectContaining({
                    message: expect.any(String),
                    statusCode: 201,
                    category: {
                        id: expect.any(Number),
                        name: category2.name
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
            const res = await userRequest(request(app.getHttpServer()).post('/category'))
                .send(category3)
                .expect(201)
            
            const get_res = await userRequest(request(app.getHttpServer()).get(`/category/${res.body.id}`))
                .expect(200)
            expect(get_res.body).toStrictEqual({
                id: res.body.id,
                name: category3.name
            })
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
            
            // Registrando todas as categorias
            let categories = [category1, category2, category3, category4]
            for (let category of categories) {
                await userRequest(request(app.getHttpServer()).post('/category'))
                    .send(category)
                    .expect(201)
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
            
            const { body: category } = await adminRequest(request(app.getHttpServer()).post('/category'))
                .send(category1)
            
            const res = await adminRequest(request(app.getHttpServer()).patch(`/category/${category.id}`))
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
                        id: category.id,
                        name: 'New Category Name'
                    }
                })
            )

            // Validando se foi atualizado
            const get_res = await userRequest(request(app.getHttpServer()).get(`/category/${category.id}`))
                .expect(200)
            
            expect(get_res.body).toStrictEqual({
                id: category.id,
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
            const { body: category } = await adminRequest(request(app.getHttpServer()).post('/category'))
                .send(category1)
            
            const res = await adminRequest(request(app.getHttpServer()).patch(`/category/${category.id}`))
                .send({
                    not_exists_prop: 'Foo Value'
                })
                .expect(400)
            
            validateError(res.body, 400)
        })
    })

    describe('(DELETE) /category/:id', () => {
        it('Deleta uma categoria', async () => {
            const { body: category } = await adminRequest(request(app.getHttpServer()).post('/category'))
                .send(category1)
            
            const res = await adminRequest(request(app.getHttpServer()).delete(`/category/${category.id}`))
                .expect(200)
            
            expect(res.body).toEqual(
                expect.objectContaining({
                    message: expect.any(String),
                    statusCode: 200,
                    category: {
                        id: category.id,
                        name: category.name
                    }
                })
            )

            // Validando se deletou
            const getRes = await adminRequest(request(app.getHttpServer()).get(`/category/${category.id}`))
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
