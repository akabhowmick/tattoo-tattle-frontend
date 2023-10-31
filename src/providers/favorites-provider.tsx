/* eslint-disable react/react-in-jsx-scope */
import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { toggleFavoriteInDB } from "../api/FavoritesRequests/toggle-fav";
import { getFavoritesFromDB } from "../api/get-info-db";
import { Artist, Client, Favorite } from "../types/interface";

interface FavoriteContextType {
  favorites: Favorite[];
  toggleFavorites: ({
    userId,
    tattooId,
  }: {
    userId: number;
    tattooId: number;
  }) => Promise<void>;
  setFavorites: React.Dispatch<React.SetStateAction<Favorite[]>>;
  refetchFavorites: () => Promise<void>;
}

const initialFavoritesArray: Favorite[] = [];

const FavoritesContext = createContext<FavoriteContextType>(
  {} as FavoriteContextType
);

export const FavoritesProvider = ({
  children,
  user,
  authorizationString,
}: {
  children: ReactNode;
  user: Artist | Client;
  authorizationString: string;
}) => {
  const [favorites, setFavorites] = useState(initialFavoritesArray);

  const refetchFavorites = async () => {
    if (user && user.type === "Client") {
      const allFavs: Favorite[] = await getFavoritesFromDB();
      const clientFavorites: Favorite[] = allFavs.filter(
        (favorite: Favorite) => favorite.clientId === user.id
      );
      setFavorites(clientFavorites);
    }
  };

  useEffect(() => {
    refetchFavorites();
  }, [user]);

  const toggleFavorites = async ({
    userId,
    tattooId,
  }: {
    userId: number;
    tattooId: number;
  }) => {
    toggleFavoriteInDB({ userId, tattooId, authorizationString }).then(() =>
      refetchFavorites()
    );
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorites,
        setFavorites,
        refetchFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavoritesContext = () => useContext(FavoritesContext);
