import { Artist, Client } from "../../types/interface";
import { API_CONFIG } from "../config";

export const addClientToDB = ({
  firstName,
  lastName,
  email,
  password,
  phoneNumber,
  type,
}: Client) => {
  const body = JSON.stringify({
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    type,
  });

  return fetch(API_CONFIG.baseURL + "/clients/", {
    method: "POST",
    headers: {
      ["Content-Type"]: "application/json",
    },
    body,
  });
};

export const addArtistToDB = ({
  firstName,
  lastName,
  email,
  password,
  phoneNumber,
  statesLocation,
  tattooStyles,
  type,
}: Artist) => {
  const body = JSON.stringify({
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    statesLocation,
    tattooStyles,
    type,
  });

  return fetch(API_CONFIG.baseURL + "/artists", {
    method: "POST",
    headers: {
      ["Content-Type"]: "application/json",
    },
    body,
  });
};
