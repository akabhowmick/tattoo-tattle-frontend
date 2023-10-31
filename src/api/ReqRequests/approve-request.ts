import { API_CONFIG } from "../config";

export const updateRequestInDB = (
  requestId: number,
  approvalStatus: string,
  authorizationString: string
) => {
  return fetch(API_CONFIG.baseURL + "/requests/" + requestId, {
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
