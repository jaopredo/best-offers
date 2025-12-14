import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import request from 'supertest'
import { App } from 'supertest/types'
import { AppModule } from '../src/app.module'

/* REPOSITÓRIOS */
import { DataSource } from 'typeorm'

describe('Authentication (e2e)', () => {
    let app: INestApplication<App>
    let dataSource: DataSource

    beforeAll(async () => {
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

        // Resetando todas as informações no banco de teste para realizar os testes
        // seguidamente quantas vezes eu quiser
        dataSource = app.get<DataSource>(DataSource)
        const entities = dataSource.entityMetadatas
        for (const entity of entities) {
        const repository = dataSource.getRepository(entity.name)
        await repository.query(`TRUNCATE TABLE "${entity.tableName}" RESTART IDENTITY CASCADE`)
        }
    })

    afterAll(async () => {
        await app.close()
    })

    const register_user = {
        email: 'foo@gmail.com',
        password: '12345678',
        name: 'Foo User'
    }

    const login_user = {
        email: 'foo@gmail.com',
        password: '12345678',
    }

    it('Passando o corpo faltando valores', async () => {
        await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                name: 'Foo User',
                email: 'foo@gmail'
            })
            .expect(400)
        
        await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                name: 'Foo User',
                password: '12345678'
            })
            .expect(400)
        
        await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                email: 'foo@gmail',
                password: '12345678'
            })
            .expect(400)
    })
    
    it('Registra um usuário, testa o registro de um mesmo email e testa o login', async () => {
        // Registrando o usuário
        const register_res = await request(app.getHttpServer())
            .post('/auth/register')
            .send(register_user)
            .expect(201)
        // Formato esperado da resposta do corpo da requisição
        expect(register_res.body).toEqual(
            expect.objectContaining({
                message: expect.any(String),
                token: expect.any(String),
                statusCode: 201
            })
        )
        
        // Tentando registrar o mesmo usuário novamente
        const duplicate_register_res = await request(app.getHttpServer())
            .post('/auth/register')
            .send(register_user)
            .expect(400)
        // Formato esperado da resposta do corpo da requisição
        expect(duplicate_register_res.body).toEqual(
            expect.objectContaining({
                message: expect.any(String),
                error: expect.any(String),
                statusCode: 400
            })
        )
        
        // Fazendo login do usuário antes registrado
        const login_res = await request(app.getHttpServer())
            .post('/auth/login')
            .send(login_user)
            .expect(200)
        // Checando o corpo da requisição
        expect(login_res.body).toEqual(
            expect.objectContaining({
                message: expect.any(String),
                token: expect.any(String),
                statusCode: 200
            })
        )
    })

    it('Tenta fazer login de um usuário que não está registrado', async () => {
        const failed_login_res = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'notRegisteredFoo@gmail.com',
                password: '12345678'
            })
            .expect(404)
        expect(failed_login_res.body).toEqual(
            expect.objectContaining({
                message: expect.any(String),
                error: expect.any(String),
                statusCode: 404
            })
        )
    })
})
