import express from 'express';
import cors from 'cors';
import { Middleware } from './middleware/middleware';

const start = async (): Promise<void> => {
    const app = express();
    app.use(cors());
    app.options("*", cors());
    app.use(express.json());

    const middleware = new Middleware();
    const router = middleware.createRouter();
    app.use(router);

    app.listen(8080, () => {
        console.log('Server is running on port 8080');
    });
};

start();
