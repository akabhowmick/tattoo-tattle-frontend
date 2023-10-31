import { Tattoo } from "../../types/interface";
import { API_CONFIG } from "../config";

export const addTattooToDB = (
  {
    artistId,
    title,
    image,
    dateCreated,
    artistName,
    description,
    price,
    statesInput,
    tattooStyleInput,
  }: Tattoo,
  authorizationString: string
) => {
  const body = JSON.stringify({
    artistId,
    title,
    image,
    dateCreated,
    artistName,
    description,
    price,
    statesInput,
    tattooStyleInput,
  });

  return fetch(API_CONFIG.baseURL + "/tattoos/", {
    method: "POST",
    headers: {
      Authorization: authorizationString,
      ["Content-Type"]: "application/json",
    },
    body,
  });
};
