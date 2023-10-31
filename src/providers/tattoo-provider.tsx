/* eslint-disable react/react-in-jsx-scope */
import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { getFavoritesFromDB, getTattoosFromDB } from "../api/get-info-db";
import { addTattooToDB } from "../api/TattooRequests/add-tattoo";
import { deleteTattooFromDb } from "../api/TattooRequests/delete-tattoo";
import { updateTattooInDB } from "../api/TattooRequests/edit-tattoo";
import { Artist, Client, Favorite, Tattoo } from "../types/interface";

interface TattooContextType {
  tattoos: Tattoo[];
  activeSelector: string;
  activeSelectorClick: (selector: string, userId: number) => void;
  addTattoo: (tattoo: Tattoo) => Promise<void>;
  deleteTattoo: (tattooId: number) => Promise<void>;
  updateTattoo: (
    id: number,
    title: string,
    description: string
  ) => Promise<void>;
  handleFilters: (
    filterType: string,
    filterValue: string[] | number
  ) => Promise<void>;
  filters: {
    price: number;
    states: string[];
    styles: string[];
  };
  deleteFromFilters: (
    filterType: string,
    filterValue: string[] | string
  ) => Promise<void>;
  refetchTattoos: () => Promise<void>;
}

const TattooTattleContext = createContext<TattooContextType>(
  {} as TattooContextType
);

const initialTattooArray: Tattoo[] = [];
const emptyStringArray: string[] = [];
const initialFilters = {
  price: 0,
  states: emptyStringArray,
  styles: emptyStringArray,
};

export const TattooProvider = ({
  children,
  userType,
  user,
  loggedIn,
  authorizationString,
}: {
  children: ReactNode;
  userType: string;
  user: Artist | Client;
  loggedIn: boolean;
  authorizationString: string;
}) => {
  const [tattoos, setTattoos] = useState(initialTattooArray);
  const [activeSelector, setActiveSelector] = useState("all");
  const [filters, setFilters] = useState(initialFilters);

  const addTattoo = async (tattoo: Tattoo) => {
    await addTattooToDB(
      {
        artistId: tattoo.artistId,
        title: tattoo.title,
        image: tattoo.image,
        dateCreated: tattoo.dateCreated,
        artistName: tattoo.artistName,
        description: tattoo.description,
        price: tattoo.price,
        statesInput: tattoo.statesInput,
        tattooStyleInput: tattoo.tattooStyleInput,
      },
      authorizationString
    );
    refetchTattoos();
  };

  const updateTattoo = async (
    id: number,
    title: string,
    description: string
  ) => {
    await updateTattooInDB(id, title, description, authorizationString);
    refetchTattoos();
  };

  const deleteTattoo = async (tattooId: number) => {
    await deleteTattooFromDb(tattooId, authorizationString);
    refetchTattoos();
  };

  const displayFavs = async (userId: number) => {
    const allTats: Tattoo[] = await getTattoosFromDB();
    const allFavs: Favorite[] = await getFavoritesFromDB();
    const userFavs = allFavs.filter((favorite) => favorite.clientId === userId);
    const favTats: Tattoo[] = [];
    userFavs.forEach((userFav: Favorite) => {
      allTats.forEach((tattoo: Tattoo) => {
        if (tattoo.id === userFav.tattooId) {
          favTats.push(tattoo);
        }
      });
    });
    setTattoos(favTats);
  };

  const activeSelectorClick = (selector: string, userId: number) => {
    setFilters(initialFilters);
    refetchTattoos();
    if (selector === activeSelector) {
      setActiveSelector("all");
    } else {
      if (selector === "favs" || selector === "reqs" || selector === "all")
        setActiveSelector(selector);
    }
    if (
      (selector === "favs" && activeSelector !== "favs") ||
      selector === "refresh-favs"
    ) {
      displayFavs(userId);
    }
  };

  const filterByPrice = async (tatArray: Tattoo[], price: number) => {
    let tatsFilteredByPrice = tatArray;
    if (price) {
      tatsFilteredByPrice = tatArray.filter((tattoo) => tattoo.price === price);
    }
    return tatsFilteredByPrice;
  };

  const filterByStates = async (tatArray: Tattoo[], states: string[]) => {
    let tatsFilteredByStates: Tattoo[] = [];
    if (states.length !== 0) {
      states.forEach((state) => {
        tatArray.filter((tattoo) => {
          if (
            tattoo.statesInput.includes(state) &&
            !tatsFilteredByStates.includes(tattoo)
          ) {
            tatsFilteredByStates.push(tattoo);
          }
        });
      });
    } else {
      tatsFilteredByStates = tatArray;
    }
    return tatsFilteredByStates;
  };

  const filterByStyles = async (tatArray: Tattoo[], styles: string[]) => {
    let tatsFilteredByStyles: Tattoo[] = [];
    if (styles.length !== 0) {
      styles.forEach((style) => {
        tatArray.filter((tattoo) => {
          if (
            tattoo.tattooStyleInput.includes(style) &&
            !tatsFilteredByStyles.includes(tattoo)
          ) {
            tatsFilteredByStyles.push(tattoo);
          }
        });
      });
    } else {
      tatsFilteredByStyles = tatArray;
    }
    return tatsFilteredByStyles;
  };

  const handleFilters = async (
    filterType: string,
    filterValue: string[] | number
  ) => {
    setFilters({ ...filters, [filterType]: filterValue });
    const allTats = await getTattoosFromDB();
    let filteredByPrice: Tattoo[] = [];
    let filteredByStatesPrice: Tattoo[] = [];
    let filteredByStylesStatesPrice: Tattoo[] = [];
    if (filterType === "price") {
      filteredByPrice = await filterByPrice(allTats, filterValue as number);
      filteredByStatesPrice = await filterByStates(
        filteredByPrice,
        filters.states
      );
      filteredByStylesStatesPrice = await filterByStyles(
        filteredByStatesPrice,
        filters.styles
      );
    } else if (filterType === "styles") {
      filteredByPrice = await filterByPrice(allTats, filters.price);
      filteredByStatesPrice = await filterByStates(
        filteredByPrice,
        filters.states
      );
      filteredByStylesStatesPrice = await filterByStyles(
        filteredByStatesPrice,
        filterValue as string[]
      );
    } else if (filterType === "states") {
      filteredByPrice = await filterByPrice(allTats, filters.price);
      filteredByStatesPrice = await filterByStates(
        filteredByPrice,
        filterValue as string[]
      );
      filteredByStylesStatesPrice = await filterByStyles(
        filteredByStatesPrice,
        filters.styles
      );
    }
    setTattoos(filteredByStylesStatesPrice);
  };

  const deleteFromFilters = async (
    filterType: string,
    filterValue: string[] | string
  ) => {
    if (filterType === "styles") {
      const filteredStyled: string[] = filters.styles.filter(
        (style) => style != filterValue
      );
      handleFilters("styles", filteredStyled);
    } else if (filterType === "states") {
      const filteredStates: string[] = filters.states.filter(
        (state) => state != filterValue
      );
      handleFilters("states", filteredStates);
    }
  };

  const refetchTattoos = async () => {
    const allTats: Tattoo[] = await getTattoosFromDB();
    if (userType === "client") {
      setTattoos(allTats);
    } else {
      const artistTats = allTats.filter((tat) => tat.artistId === user?.id);
      setTattoos(artistTats);
    }
  };

  useEffect(() => {
    refetchTattoos();
    setActiveSelector("all");
    setFilters(initialFilters);
  }, [loggedIn]);

  return (
    <TattooTattleContext.Provider
      value={{
        tattoos,
        activeSelector,
        activeSelectorClick,
        addTattoo,
        deleteTattoo,
        updateTattoo,
        handleFilters,
        filters,
        refetchTattoos,
        deleteFromFilters,
      }}
    >
      {children}
    </TattooTattleContext.Provider>
  );
};

export const useTattooTattleContext = () => useContext(TattooTattleContext);
