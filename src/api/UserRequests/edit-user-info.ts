import { API_CONFIG } from "../config";

export const updateClientInDB = (
  clientId: number,
  email: string,
  password: string,
  authorizationString: string
) => {
  return fetch(API_CONFIG.baseURL + "/clients/" + clientId, {
    method: "PATCH",
    headers: {
      Authorization: authorizationString,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

export const updateArtistInDB = (
  artistId: number,
  email: string,
  password: string,
  authorizationString: string
) => {
  return fetch(API_CONFIG.baseURL + "/artists/" + artistId, {
    headers: {
      "Content-Type": "application/json",
      Authorization: authorizationString,
    },
    method: "PATCH",
    body: JSON.stringify({
      email,
      password,
    }),
  });
};
