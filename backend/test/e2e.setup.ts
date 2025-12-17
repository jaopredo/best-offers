import { TestingModule, Test } from "@nestjs/testing"
import { ConfigModule } from "@nestjs/config"
import { AppModule } from "src/app.module"
import { ValidationPipe } from "@nestjs/common"
import { DataSource } from "typeorm"

export default async function e2eSetup() {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
            ConfigModule.forRoot({
                envFilePath: ['.env.test.local'],
            }),
            AppModule
        ],
    }).compile()

    const app = moduleFixture.createNestApplication()

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
                exposeUnsetFields: false,
            },
        })
    )

    await app.init()

    const dataSource = app.get<DataSource>(DataSource)

    await dataSource.synchronize()

    return { app, dataSource }
}
