import { Dayjs } from "dayjs";

export type MessagePayload = {
  type: string;
  email?: string;
  phone?: string;
  endpoint: string;
  subject: string;
  message: string;
};

export interface payload {
  firstName?: string;
  lastName?: string;
  dob?: Dayjs | null;
  ssn?: string;
  phone?: string;
  email?: string;
  zip?: string;
}
export interface updatePayload {
  attributes: {
    isVerified: boolean;
    barcode: string;
  };
  token: string;
}

export interface verificationSessionPayload {
  successUrl?: string;
  failureUrl?: string;
  type?: string;
  productGroupId?: string;
  customerIn?: boolean;
}

export interface componentsParameterInterface {
  setStep: any;
  setPrevStep: any;
  skin: string;
  matchesSM: boolean;
}
export interface Session {
  token: string;
  flowStatus: string;
  sessionStatus: string;
  ageThreshold: number;
  expiresAt: Date;
  isUsed: boolean;
  redirectUrl: string;
}
