import { API_CONFIG } from "../config";

export const updateTattooInDB = (
  tattooId: number,
  title: string,
  description: string,
  authorizationString: string
) => {
  return fetch(API_CONFIG.baseURL + "/tattoos/" + tattooId, {
    headers: {
      "Content-Type": "application/json",
      Authorization: authorizationString,
    },
    method: "PATCH",
    body: JSON.stringify({
      title,
      description,
    }),
  });
};
