import { Request } from "../../types/interface";
import { API_CONFIG } from "../config";

export const addRequestToDB = (
  {
    clientName,
    artistName,
    messageBody,
    approvalStatus,
    tattooOfInterestTitle,
    artistId,
    clientId,
  }: Request,
  authorizationString: string
) => {
  const body = JSON.stringify({
    clientName,
    artistName,
    messageBody,
    approvalStatus,
    tattooOfInterestTitle,
    artistId,
    clientId,
  });
  console.log(authorizationString);
  return fetch(API_CONFIG.baseURL + "/requests/", {
    method: "POST",
    headers: {
      Authorization: authorizationString,
      ["Content-Type"]: "application/json",
    },
    body,
  });
};
