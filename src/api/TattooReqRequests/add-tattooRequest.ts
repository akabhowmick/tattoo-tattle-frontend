import { TattooRequest } from "../../types/interface";
import { API_CONFIG } from "../config";

export const addTattooRequestToDB = (
  {
    clientName,
    artistName,
    messageBody,
    approvalStatus,
    tattooOfInterestTitle,
    artistId,
    clientId,
  }: TattooRequest,
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
  return fetch(API_CONFIG.baseURL + "/tattooRequests/", {
    method: "POST",
    headers: {
      Authorization: authorizationString,
      ["Content-Type"]: "application/json",
    },
    body,
  });
};
