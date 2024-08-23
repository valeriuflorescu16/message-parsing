import { Middleware } from '../../src/middleware/middleware';
import request from 'supertest';
import express from 'express';

describe("middleware", () => {
    let middleware: Middleware;
    let message: string;

    beforeAll(() => {
        middleware = new Middleware();
        message = "MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233\n||DATA^TYPE|123456|P|2.5\nEVT|TYPE|20230502112233\nPRS|1|9876543210^^^Location^ID||Florescu^Valeriu|||M|19990530|\nDET|1|I|^^MainDepartment^101^Room 1|Common Cold"
    })

    describe("createRouter", () => {
        let router: express.Router;
        let app: express.Application;
        beforeAll(() => {
            router = middleware.createRouter();
            app = express();
            app.use(router);
        })

        it('creates router', () => {
            expect(router).toBeDefined();
        })

        it('responds with status 200 to /patientMessage post request if valid request body', async () => {
            const response = await request(app).post('/patientMessage').send({ message });
            expect(response.status).toBe(200);
        });

        it('responds with status 400 to /patientMessage post request if invalid request body', async () => {
            const invalidMessage = 'invalidMessage';
            const response = await request(app).post('/patientMessage').send({ message: invalidMessage });
            expect(response.status).toBe(400);
        });
    })
})
