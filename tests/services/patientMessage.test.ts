import { parseMessage } from "../../src/services/patientMessage";

describe("patientMessage", () => {
    let jsonPatientMessage: string;

    beforeEach(() => {
        jsonPatientMessage = "MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233\n||DATA^TYPE|123456|P|2.5\nEVT|TYPE|20230502112233\nPRS|1|9876543210^^^Location^ID||Florescu^Valeriu^A|||M|19801031|\nDET|1|I|^^MainDepartment^101^Room 1|Common Cold"
    })

    describe("parseMessage", () => {
        it("throws an error if MSG segment is missing", () => {
            jsonPatientMessage = jsonPatientMessage.replace("MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233", "");

            try {
                parseMessage(jsonPatientMessage);
                fail();
            } catch (error) {
                expect(error.message).toBe("Missing MSG segment.");
            }
        });

        it('throws an error if PRS segment is missing', () => {
            jsonPatientMessage = jsonPatientMessage.replace("PRS|1|9876543210^^^Location^ID||Florescu^Valeriu^A|||M|19801031|", "");

            try {
                parseMessage(jsonPatientMessage);
                fail();
            } catch (error) {
                expect(error.message).toBe("Missing PRS segment.");
            }
        });

        it('throws an error if DET segment is missing', () => {
            jsonPatientMessage = jsonPatientMessage.replace("DET|1|I|^^MainDepartment^101^Room 1|Common Cold", "");

            try {
                parseMessage(jsonPatientMessage);
                fail();
            } catch (error) {
                expect(error.message).toBe("Missing DET segment.");
            }
        });

        it('throws an error if EVT segment is missing', () => {
            jsonPatientMessage = jsonPatientMessage.replace("EVT|TYPE|20230502112233", "");

            try {
                parseMessage(jsonPatientMessage);
                fail();
            } catch (error) {
                expect(error.message).toBe("Missing EVT segment.");
            }
        });

        it('throws an error if date format has more characters than expected', () => {
            jsonPatientMessage = jsonPatientMessage.replace("19801031", "198010311");

            try {
                parseMessage(jsonPatientMessage);
                fail();
            } catch (error) {
                expect(error.message).toBe("Invalid date format.");
            }
        });

        it('throws an error if date format has less characters than expected', () => {
            jsonPatientMessage = jsonPatientMessage.replace("19801031", "1980103");

            try {
                parseMessage(jsonPatientMessage);
                fail();
            } catch (error) {
                expect(error.message).toBe("Invalid date format.");
            }
        });

        it('throws an error if date format is empty', () => {
            jsonPatientMessage = jsonPatientMessage.replace("19801031", "");

            try {
                parseMessage(jsonPatientMessage);
                fail();
            } catch (error) {
                expect(error.message).toBe("Invalid date format.");
            }
        });

        it('throws an error if date contains invalid characters', () => {
            jsonPatientMessage = jsonPatientMessage.replace("19801031", "19801a31");

            try {
                parseMessage(jsonPatientMessage);
                fail();
            } catch (error) {
                expect(error.message).toBe("Invalid date format.");
            }
        });

        it('throws an error if date month is invalid', () => {
            jsonPatientMessage = jsonPatientMessage.replace("19801031", "19801331");

            try {
                parseMessage(jsonPatientMessage);
                fail();
            } catch (error) {
                expect(error.message).toBe("Invalid date value.");
            }
        });

        it('throws an error if date day is invalid', () => {
            jsonPatientMessage = jsonPatientMessage.replace("19801031", "19801032");

            try {
                parseMessage(jsonPatientMessage);
                fail();
            } catch (error) {
                expect(error.message).toBe("Invalid date value.");
            }
        });

        it('throws an error if date year is invalid', () => {
            jsonPatientMessage = jsonPatientMessage.replace("19801031", "00001031");

            try {
                parseMessage(jsonPatientMessage);
                fail();
            } catch (error) {
                expect(error.message).toBe("Invalid date value.");
            }
        });

        it('throws an error if last name is missing', () => {
            jsonPatientMessage = jsonPatientMessage.replace("Florescu^Valeriu^A", "^Valeriu");

            try {
                parseMessage(jsonPatientMessage);
                fail();
            } catch (error) {
                expect(error.message).toBe("Last name is missing.");
            }
        });

        it('throws an error if first name is missing', () => {
            jsonPatientMessage = jsonPatientMessage.replace("Florescu^Valeriu^A", "Florescu^");

            try {
                parseMessage(jsonPatientMessage);
                fail();
            } catch (error) {
                expect(error.message).toBe("First name is missing.");
            }
        });

        it('throws an error if primary condition is missing', () => {
            jsonPatientMessage = jsonPatientMessage.replace("Common Cold", "");

            try {
                parseMessage(jsonPatientMessage);
                fail();
            } catch (error) {
                expect(error.message).toBe("Primary condition is missing.");
            }
        });

        it('returns the parsed message', () => {
            const patientData = parseMessage(jsonPatientMessage);

            expect(patientData.fullName).toEqual({
                lastName: "Florescu",
                firstName: "Valeriu",
                middleName: "A"
            });

            expect(patientData.dateOfBirth).toBe("1980-10-31");
            expect(patientData.primaryCondition).toBe("Common Cold");
        });

        it('returns the parsed message without middle name', () => {
            jsonPatientMessage = jsonPatientMessage.replace("Florescu^Valeriu^A", "Florescu^Valeriu");

            const patientData = parseMessage(jsonPatientMessage);

            expect(patientData.fullName).toEqual({
                lastName: "Florescu",
                firstName: "Valeriu"
            });

            expect(patientData.dateOfBirth).toBe("1980-10-31");
            expect(patientData.primaryCondition).toBe("Common Cold");
        });
    });
})