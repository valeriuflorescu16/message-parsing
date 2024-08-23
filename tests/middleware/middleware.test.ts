import { Middleware } from '../../src/middleware/middleware';

describe("middleware", () => {
    let middleware: Middleware;

    beforeAll(() => {
        middleware = new Middleware();
    })

    describe("createRouter", () => {
        it('creates router', () => {
            const router = middleware.createRouter();
            expect(router).toBeDefined();
        })
    })
})
