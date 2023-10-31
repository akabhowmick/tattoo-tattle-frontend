/* eslint-disable react/react-in-jsx-scope */
import { useState, createContext, useContext, ReactNode } from "react";
import { getArtistsFromDB, getClientsFromDB } from "../api/get-info-db";
import { addArtistToDB, addClientToDB } from "../api/UserRequests/add-user";
import { loginArtist, loginClient } from "../api/UserRequests/login-user";
import {
  updateClientInDB,
  updateArtistInDB,
} from "../api/UserRequests/edit-user-info";
import { useEffect } from "react";
import { Artist, Client, UserSignIn } from "../types/interface";
import swal from "sweetalert";
import {
  createTokenForUser,
  createUnsecuredInfo,
  encryptPassword,
} from "../Routers/auth-utils";

interface AuthContextType {
  user: Artist | Client | null;
  setUser: React.Dispatch<React.SetStateAction<Artist | Client | null>>;
  userType: string;
  setUserType: React.Dispatch<React.SetStateAction<string>>;
  addClient: (client: Client) => Promise<void>;
  addArtist: (artist: Artist) => Promise<void>;
  signInArtist: (client: UserSignIn) => Promise<boolean>;
  signInClient: (client: UserSignIn) => Promise<void>;
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  editUser: (email: string, password: string) => Promise<void>;
  logOutUser: () => void;
  token: string;
  authorizationString: string;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userType, setUserType] = useState("");
  const [user, setUser] = useState<Artist | Client | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [authorizationString, setAuthorizationString] = useState(
    `Bearer ${localStorage.getItem("token")?.slice(1, -1)}`
  );

  const signInUser = (user: Artist | Client, token?: string) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      if (user.type === "Artist") {
        setUserType("artist");
      } else if (user.type === "Client") {
        setUserType("client");
      }
      setLoggedIn(true);
    }
    if (token) {
      localStorage.setItem("token", JSON.stringify(token));
    }
  };

  const logOutUser = () => {
    setUser(null);
    setToken("");
    setLoggedIn(false);
    setAuthorizationString("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const maybeUser = localStorage.getItem("user");
    if (maybeUser !== undefined && maybeUser !== null) {
      signInUser(JSON.parse(maybeUser!));
    }
  }, []);

  // register new user
  const addArtist = async (artist: Artist) => {
    let allArtists = await getArtistsFromDB();
    const existingUser = allArtists.find(
      (user: Artist) => user.email === artist.email
    );
    if (existingUser) {
      swal("Sign up error!", "Account with this Email already exists", "error");
    } else {
      await addArtistToDB({
        firstName: artist.firstName,
        lastName: artist.lastName,
        email: artist.email,
        password: await encryptPassword(artist.password),
        phoneNumber: artist.phoneNumber,
        tattooStyles: artist.tattooStyles,
        statesLocation: artist.statesLocation,
        type: "Artist",
      });
      allArtists = await getArtistsFromDB();
      const newAddedArtist = await allArtists.find(
        (user: Artist) => user.email === artist.email
      );
      const localInfo = createUnsecuredInfo(newAddedArtist);
      const token = await createTokenForUser(localInfo);
      signInUser(localInfo as Artist, token);
    }
  };

  const addClient = async (client: Client) => {
    let allClients = await getClientsFromDB();
    const existingUser = allClients.find(
      (user: Client) => user.email === client.email
    );
    if (existingUser) {
      swal("Sign up error!", "Account with this Email already exists", "error");
    } else {
      await addClientToDB({
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        password: await encryptPassword(client.password),
        phoneNumber: client.phoneNumber,
        type: "Client",
      });
      allClients = await getClientsFromDB();
      const newAddedClient = allClients.find(
        (user: Client) => user.email === client.email
      );
      const localInfo = createUnsecuredInfo(newAddedClient);
      const token = await createTokenForUser(localInfo);
      signInUser(localInfo as Client, token);
    }
  };

  //login old user
  const signInArtist = async (artist: UserSignIn) => {
    const response = await loginArtist({
      email: artist.email,
      password: artist.password,
    });
    response
      .json()
      .then((body) => {
        if (body.user) {
          signInUser(body.user, body.token);
        }
        setToken(body.token);
        return true;
      })
      .catch(() => {
        swal("Sign in error!", "Invalid credentials", "error");
      });
    return false;
  };

  const signInClient = async (client: UserSignIn) => {
    const response = await loginClient({
      email: client.email,
      password: client.password,
    });
    response
      .json()
      .then((body) => {
        if (body.user) {
          signInUser(body.user, body.token);
        }
        setToken(body.token);
      })
      .catch(() => {
        swal("Sign in error!", "Invalid credentials", "error");
      });
  };

  const editUser = async (email: string, password: string) => {
    const hashedNewPassword = await encryptPassword(password);
    if (userType === "client") {
      await updateClientInDB(
        user!.id!,
        email,
        hashedNewPassword,
        authorizationString
      );
    } else if (userType === "artist") {
      await updateArtistInDB(
        user!.id!,
        email,
        hashedNewPassword,
        authorizationString
      );
    }
    signInUser({
      ...user!,
      email: email,
      password: hashedNewPassword,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        userType,
        setUserType,
        addClient,
        addArtist,
        signInArtist,
        signInClient,
        loggedIn,
        setLoggedIn,
        editUser,
        logOutUser,
        token,
        authorizationString,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
