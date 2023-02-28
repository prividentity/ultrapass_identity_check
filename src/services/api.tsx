import { updatePayload, verificationSessionPayload } from "../interface";
import cryptonetsAPI from "./index";
import identityAPI from "./orchestration";
import { MessagePayload } from "../interface";

export const sendMessage = async (payload: MessagePayload) => {
  try {
    const result = await cryptonetsAPI.post(`/user/communicate`, payload);
    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const createUser = async (payload: any) => {
  try {
    const result = await cryptonetsAPI.post(`/ultrapassage/create`, payload);
    return result;
  } catch (err) {
    return err;
  }
};

export const getUser = async (payload: any) => {
  try {
    const result = await cryptonetsAPI.post(`/ultrapassage/get`, payload);
    return result;
  } catch (err) {
    return err;
  }
};

export const updateUserApi = async (payload: updatePayload) => {
  try {
    const result = await cryptonetsAPI.post(`/ultrapassage/update`, payload);
    return result;
  } catch (err) {
    return err;
  }
};

export const deleteUserApi = async (payload: updatePayload) => {
  try {
    const result = await cryptonetsAPI.post(`/ultrapassage/delete`, payload);
    return result;
  } catch (err) {
    return err;
  }
};

export const createVerificationSession = async (
  payload: verificationSessionPayload
) => {
  try {
    const result = await identityAPI.post(`/verification-session`, payload);
    return result;
  } catch (err) {
    return err;
  }
};

export const verifyTokenApi = async (id: any) => {
  try {
    const result = await identityAPI.get(`/verification-session/${id}`);
    return result;
  } catch (err) {
    return err;
  }
};

export const verifyIdApi = async ({ id, payload }: any) => {
  try {
    const result = await identityAPI.post(`/verify-id/${id}`, payload);
    return result;
  } catch (err) {
    return err;
  }
};
