import request from 'supertest';
import { App } from 'supertest/types';

export async function getUserAuthToken(app: App) {
    const user = {
        name: 'Foo User',
        password: '12345678',
        email: 'foo@email.com',
    };

    await request(app).post('/auth/register').send(user);

    const res = await request(app).post('/auth/login').send({
        email: user.email,
        password: user.password,
    });

    return res.body.token;
}

export async function getAdminAuthToken(app: App) {
    const user = {
        email: 'admin@test.com',
        password: '12345678',
    };

    const res = await request(app).post('/auth/login').send(user);

    return res.body.token;
}
