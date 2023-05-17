import { updatePayload, verificationSessionPayload } from "../interface";
import cryptonetsAPI from "./index";
import identityAPI from "./orchestration";
import { MessagePayload } from "../interface";
import { API_KEY } from "../utils";
import axios from "axios";

export const sendMessage = async (payload: MessagePayload) => {
  // try {
  //   const result = await cryptonetsAPI.post(`/user/communicate`, payload);
  //   return result;
  // } catch (err) {
  //   console.log(err);
  //   return err;
  // }
  try {
    const result = await axios.post(
      "https://api.cryptonets.ai/node/user/communicate",
      payload,
      {
        headers: {
          "x-api-key": "0000000000000000test",
        },
      }
    );
    return result.data;
  } catch (e) {
    console.log(e);
   return e;
  }
};

export const createUser = async (payload: any) => {
  try {
    const result = await cryptonetsAPI.post(`/user/create`, payload);
    return result;
  } catch (err) {
    return err;
  }
};

export const updateUserToken = async (
  payload: { customerId: string },
  verificationsessiontoken: string
) => {
  try {
    // const requestOptions: RequestInit = {
    //   method: 'PUT',
    //   body: JSON.stringify(payload),
    //   headers: {
    //     'x-api-key': process.env.REACT_APP_API_KEY || "",
    //     'Content-Type': 'application/json',
    //   },
    // };
    const result = await identityAPI.put(
      `/verification-session/${verificationsessiontoken}/customer-information`,
      payload
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const getUser = async (payload: any) => {
  try {
    const result = await cryptonetsAPI.post(`/user/get`, payload);
    return result;
  } catch (err) {
    return err;
  }
};

export const updateUserApi = async (payload: updatePayload) => {
  try {
    const result = await cryptonetsAPI.post(`/user/update`, payload);
    return result;
  } catch (err) {
    return err;
  }
};

export const getUserPortrait = async (token: any) => {
  try {
    const payload = {
      api_key: process.env.REACT_APP_API_KEY || "",
      token: token,
      type: "portrait",
    };

    const result = await cryptonetsAPI.post(
      `/user/download/imagedata`,
      payload
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const deleteUserApi = async (payload: updatePayload) => {
  try {
    const result = await cryptonetsAPI.post(`/user/delete`, payload);
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

export const getProductGroupList = async () => {
  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      x_api_key: process.env.REACT_APP_API_KEY,
    },
  };
  try {
    const result = await identityAPI.get(
      `/product-group/list/`,
      requestOptions
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const feedback = async (payload: any) => {
  try {
    const result = await cryptonetsAPI.post(`/user/communicate`, payload);
    return result;
  } catch (err) {
    return err;
  }
};
