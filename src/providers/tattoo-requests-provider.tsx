/* eslint-disable react/react-in-jsx-scope */
import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { getTattooRequestsFromDB } from "../api/get-info-db";
import { addTattooRequestToDB } from "../api/TattooReqRequests/add-tattooRequest";
import { updateTattooRequestInDB } from "../api/TattooReqRequests/update-tattooRequest";
import { Artist, Client, TattooRequest } from "../types/interface";

interface TattooRequestsContextType {
  tattooRequests: TattooRequest[];
  addTattooRequest: (tattooRequest: TattooRequest) => Promise<void>;
  editTattooRequest: (tattooRequestId: number, approval: string) => Promise<void>;
}

const TattooRequestsContext = createContext<TattooRequestsContextType>(
  {} as TattooRequestsContextType
);

export const TattooRequestsProvider = ({
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
  const [tattooRequests, setTattooRequests] = useState([]);

  const refetchTattooRequests = async () => {
    const allTattooRequests = await getTattooRequestsFromDB();
    if (userType === "client" && user) {
      const clientTattooRequests = allTattooRequests.filter(
        (tattooRequest: TattooRequest) => tattooRequest.clientId === user.id
      );
      setTattooRequests(clientTattooRequests);
    } else if (userType === "artist" && user) {
      const artistTattooRequests = allTattooRequests.filter(
        (tattooRequest: TattooRequest) => tattooRequest.artistId === user.id
      );
      setTattooRequests(artistTattooRequests);
    }
  };

  const addTattooRequest = async (tattooRequest: TattooRequest) => {
    await addTattooRequestToDB(
      {
        clientName: tattooRequest.clientName,
        artistName: tattooRequest.artistName,
        messageBody: tattooRequest.messageBody,
        approvalStatus: tattooRequest.approvalStatus,
        tattooOfInterestTitle: tattooRequest.tattooOfInterestTitle,
        artistId: tattooRequest.artistId,
        clientId: tattooRequest.clientId,
      },
      authorizationString
    );
    refetchTattooRequests();
  };

  const editTattooRequest = async (tattooRequestId: number, approval: string) => {
    await updateTattooRequestInDB(tattooRequestId, approval, authorizationString);
    refetchTattooRequests();
  };

  useEffect(() => {
    refetchTattooRequests();
  }, [loggedIn]);

  return (
    <TattooRequestsContext.Provider
      value={{
        tattooRequests,
        addTattooRequest,
        editTattooRequest,
      }}
    >
      {children}
    </TattooRequestsContext.Provider>
  );
};

export const useTattooRequestsContext = () => useContext(TattooRequestsContext);
