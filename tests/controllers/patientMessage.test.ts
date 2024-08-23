import * as Express from 'express';
import { mockDatabase } from '../../src/db/mockDatabase';
import { postParsedPatientMessage } from '../../src/controllers/patientMessage';

describe('patientMessage', () => {
    describe('postParsedPatientMessage', () => {
        let req: Express.Request;
        let res: Express.Response;
        let message: string;

        beforeEach(() => {
            message = "MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233\n||DATA^TYPE|123456|P|2.5\nEVT|TYPE|20230502112233\nPRS|1|9876543210^^^Location^ID||Florescu^Valeriu|||M|19990530|\nDET|1|I|^^MainDepartment^101^Room 1|Common Cold"
            req = {
                body: {
                    message: message
                }
            } as Express.Request;

            res = {} as Express.Response;

            res.status = jest.fn().mockReturnThis();
            res.json = jest.fn();
            mockDatabase.push = jest.fn();
        })

        it('parses and stores the message in the database', async () => {
            const parsedMessage = {
                "fullName": {
                    "lastName": "Florescu",
                    "firstName": "Valeriu"
                },
                "dateOfBirth": "1999-05-30",
                "primaryCondition": "Common Cold"
            }

            await postParsedPatientMessage(req, res);

            expect(mockDatabase.push).toHaveBeenCalledWith(parsedMessage);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(parsedMessage);
        });

        it('handles parsing errors and returns 400 status with error message', async () => {
            const invalidMessage = message.replace("19990530", "119990530");
            req.body.message = invalidMessage;
            const errorMessage = 'Invalid date format.';

            await postParsedPatientMessage(req, res);

            expect(mockDatabase.push).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
        });
    });
})
