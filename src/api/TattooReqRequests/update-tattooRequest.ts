import { API_CONFIG } from "../config";

export const updateTattooRequestInDB  = (
  requestId: number,
  approvalStatus: string,
  authorizationString: string
) => {
  return fetch(API_CONFIG.baseURL + "/tattooRequests/" + requestId, {
    headers: {
      "Content-Type": "application/json",
      Authorization: authorizationString,
    },
    method: "PATCH",
    body: JSON.stringify({
      approvalStatus,
    }),
  });
};
