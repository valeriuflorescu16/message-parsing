import * as Express from 'express';
import { parseMessage } from '../services/patientMessage';
import { mockDatabase } from '../db/mockDatabase';

export const postParsedPatientMessage = async (req: Express.Request, res: Express.Response): Promise<void> => {
    const message = req.body.message;
    let parsedMessage;
    try {
        parsedMessage = parseMessage(message);
        mockDatabase.push(parsedMessage);
    } catch (error) {
        res.status(400).json({ error: error.message });
        return;
    }

    res.status(200).json(parsedMessage);
}