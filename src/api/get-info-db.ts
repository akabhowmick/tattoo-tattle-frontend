import { API_CONFIG } from "./config";

export const getClientsFromDB = () => {
  return fetch(API_CONFIG.baseURL + "/clients").then((response) => {
    return response.json();
  });
};

export const getArtistsFromDB = () => {
  return fetch(API_CONFIG.baseURL + "/artists").then((response) => {
    return response.json();
  });
};

export const getTattoosFromDB = () => {
  return fetch(API_CONFIG.baseURL + "/tattoos").then((response) => {
    return response.json();
  });
};

export const getTattooRequestsFromDB = () => {
  return fetch(API_CONFIG.baseURL + "/tattooRequests").then((response) => {
    return response.json();
  });
};

export const getFavoritesFromDB = () => {
  return fetch(API_CONFIG.baseURL + "/favorites", {
    method: "GET",
  }).then((response) => {
    return response.json();
  });
};
