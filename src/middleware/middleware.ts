import express, { Router } from 'express';
import * as patientMessageController from '../controllers/patientMessage';

export class Middleware {
    createRouter(): Router {
        const router = express.Router({ caseSensitive: true });
        router.use(express.json({ limit: '1mb' }));

        router.post('/patientMessage', patientMessageController.postParsedPatientMessage);

        return router;
    }
}
