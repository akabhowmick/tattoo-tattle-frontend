/* eslint-disable react/react-in-jsx-scope */
import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { getRequestsFromDB } from "../api/get-info-db";
import { addRequestToDB } from "../api/ReqRequests/add-request";
import { updateRequestInDB } from "../api/ReqRequests/approve-request";
import { Artist, Client, Request } from "../types/interface";

interface RequestsContextType {
  requests: Request[];
  addRequest: (request: Request) => Promise<void>;
  editRequest: (requestId: number, approval: string) => Promise<void>;
}

const RequestsContext = createContext<RequestsContextType>(
  {} as RequestsContextType
);

export const RequestsProvider = ({
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
  const [requests, setRequests] = useState([]);

  const refetchRequests = async () => {
    const allRequests = await getRequestsFromDB();
    if (userType === "client" && user) {
      const clientRequests = allRequests.filter(
        (request: Request) => request.clientId === user.id
      );
      setRequests(clientRequests);
    } else if (userType === "artist" && user) {
      const artistRequests = allRequests.filter(
        (request: Request) => request.artistId === user.id
      );
      setRequests(artistRequests);
    }
  };

  const addRequest = async (request: Request) => {
    await addRequestToDB(
      {
        clientName: request.clientName,
        artistName: request.artistName,
        messageBody: request.messageBody,
        approvalStatus: request.approvalStatus,
        tattooOfInterestTitle: request.tattooOfInterestTitle,
        artistId: request.artistId,
        clientId: request.clientId,
      },
      authorizationString
    );
    refetchRequests();
  };

  const editRequest = async (requestId: number, approval: string) => {
    await updateRequestInDB(requestId, approval, authorizationString);
    refetchRequests();
  };

  useEffect(() => {
    refetchRequests();
  }, [loggedIn]);

  return (
    <RequestsContext.Provider
      value={{
        requests,
        addRequest,
        editRequest,
      }}
    >
      {children}
    </RequestsContext.Provider>
  );
};

export const useRequestsContext = () => useContext(RequestsContext);
