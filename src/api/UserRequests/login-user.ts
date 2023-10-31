import { API_CONFIG } from "../config";

export const loginClient = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const body = JSON.stringify({ email, password });
  return fetch(API_CONFIG.baseURL + "/clients/login", {
    method: "POST",
    headers: {
      ["Content-Type"]: "application/json",
    },
    body,
  });
};

export const loginArtist = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const body = JSON.stringify({ email, password });
  return fetch(API_CONFIG.baseURL + "/artists/login", {
    method: "POST",
    headers: {
      ["Content-Type"]: "application/json",
    },
    body,
  });
};
