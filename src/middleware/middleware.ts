import express, { Router } from 'express';

export class Middleware {
    createRouter(): Router {
        const router = express.Router({ caseSensitive: true });

        router.use(express.json({ limit: '1mb' }));

        return router;
    }
}
