import { API_CONFIG } from "../config";

export const deleteTattooFromDb = (
  tattooId: number,
  authorizationString: string
) => {
  return fetch(API_CONFIG.baseURL + "/tattoos/" + tattooId, {
    method: "DELETE",
    headers: {
      Authorization: authorizationString,
    },
  });
};
