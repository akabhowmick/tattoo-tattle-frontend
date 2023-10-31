/* eslint-disable react/react-in-jsx-scope */
import { Outlet } from "react-router-dom";
import { Login } from "../Components/Login/Login";
//import { ClientInterface } from "../Components/UserInterface/ClientInterface";
import { useAuthContext } from "../providers/auth-provider";

export const ClientProtectedRoute = () => {
  const { loggedIn, user } = useAuthContext();
  return loggedIn && user?.type === "Client" ? <Outlet /> : <Login />;
};

export const ArtistProtectedRoute = () => {
  const { loggedIn, user } = useAuthContext();
  return loggedIn && user?.type === "Artist" ? <Outlet /> : <Login />;
};
