import { IPatientData } from "../types/iPatientData";
import { SegmentCode } from "../types/segmentCode";


const validateMessageSegments = (segments: string[]): void => {
    const segmentCodesCountMap = new Map<string, number>();
    for (const segment of segments) {
        const code = segment.split('|')[0];
        segmentCodesCountMap.set(code, (segmentCodesCountMap.get(code) || 0) + 1);
    }

    const segmentCodes = Object.values(SegmentCode);
    for (const code of segmentCodes) {
        if (!segmentCodesCountMap.has(code)) {
            throw new Error(`Missing ${code} segment.`);
        }

        if (segmentCodesCountMap.get(code) !== 1) {
            throw new Error(`Multiple ${code} segments found.`);
        }
    }
}

const validateDateString = (dateStr: string): void => {
    // This regex checks that the date string is in the format YYYYMMDD, i.e. start of line, 8 digits, end of line
    const formatRegex = /^\d{8}$/;
    if (!formatRegex.test(dateStr)) {
        throw new Error("Invalid date format.");
    }

    const year = parseInt(dateStr.slice(0, 4), 10);
    const month = parseInt(dateStr.slice(4, 6), 10) - 1;
    const day = parseInt(dateStr.slice(6, 8), 10);

    const date = new Date(year, month, day);

    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
        throw new Error("Invalid date value.");
    }
};

const parseSegment = (segment: string, patientData: IPatientData): void => {
    const fields = segment.split('|');
    const code = fields[0];

    if (code === SegmentCode.PRS) {
        const nameComponents = fields[4].split('^');

        const lastName = nameComponents[0];
        if (!lastName) {
            throw new Error("Last name is missing.");
        }

        const firstName = nameComponents[1];
        if (!firstName) {
            throw new Error("First name is missing.");
        }

        patientData.fullName = {
            lastName,
            firstName,
        };

        if (nameComponents[2] !== undefined) {
            patientData.fullName.middleName = nameComponents[2];
        }

        const dateOfBirthStr = fields[8];
        validateDateString(dateOfBirthStr);
        patientData.dateOfBirth = formatDateString(dateOfBirthStr);
    }

    if (code === SegmentCode.DET) {
        let primaryCondition = fields[4];
        if (!primaryCondition) {
            throw new Error("Primary condition is missing.");
        }
        patientData.primaryCondition = primaryCondition;
    }
}

export const parseMessage = (message: string): IPatientData => {
    const segments = message.split('\n');
    validateMessageSegments(segments);

    let patientData = {} as IPatientData;
    segments.forEach(segment => {
        parseSegment(segment, patientData);
    });

    return patientData;
}

function formatDateString(dateStr: string): string {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
}
