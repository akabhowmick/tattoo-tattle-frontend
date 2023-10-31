import { Favorite } from "../../types/interface";
import { API_CONFIG } from "../config";
import { getFavoritesFromDB } from "../get-info-db";

export const createFavorite = (
  userId: number,
  tattooId: number,
  authorizationString: string
) => {
  const body = JSON.stringify({
    clientId: userId,
    tattooId,
  });
  fetch(API_CONFIG.baseURL + "/favorites/", {
    method: "POST",
    headers: {
      Authorization: authorizationString,
      ["Content-Type"]: "application/json",
    },
    body,
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to create new favorite");
    }
    return response;
  });
};

export const deleteFavorite = (id: number, authorizationString: string) => {
  fetch(API_CONFIG.baseURL + "/favorites/" + id, {
    method: "DELETE",
    headers: {
      Authorization: authorizationString,
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to delete favorite");
    }
    return response;
  });
};

export const toggleFavoriteInDB = async ({
  userId,
  tattooId,
  authorizationString,
}: {
  userId: number;
  tattooId: number;
  authorizationString: string;
}) => {
  const allFavorites = await getFavoritesFromDB();
  const matchingFavorite = allFavorites.find(
    (favorite: Favorite) =>
      favorite.clientId === userId && favorite.tattooId === tattooId
  );
  if (matchingFavorite) {
    return await deleteFavorite(matchingFavorite.id, authorizationString);
  } else {
    return await createFavorite(userId, tattooId, authorizationString);
  }
};
