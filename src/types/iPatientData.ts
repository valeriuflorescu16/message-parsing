import { IFullName } from "./iFullName";

export interface IPatientData {
    fullName: IFullName;
    dateOfBirth: string;
    primaryCondition: string;
}