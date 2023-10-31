/* eslint-disable react/react-in-jsx-scope */
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import { CreateAccount } from "./Components/Login/CreateAccount";
import { Login } from "./Components/Login/Login";
import { NotFound } from "./Components/NotFound";
import { ArtistInterface } from "./Components/UserInterface/ArtistInterface";
import { ClientInterface } from "./Components/UserInterface/ClientInterface";
import {
  ClientProtectedRoute,
  ArtistProtectedRoute,
} from "./layouts/ProtectedRoutes";
import RootLayout from "./layouts/RootLayout";
import { useAuthContext } from "./providers/auth-provider";
import { FavoritesProvider } from "./providers/favorites-provider";
import { RequestsProvider } from "./providers/requests-provider";
import { TattooProvider } from "./providers/tattoo-provider";

function App() {
  const { userType, user, loggedIn, authorizationString } = useAuthContext();
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Login />} />
        <Route path="signup" element={<CreateAccount />} />
        <Route element={<ClientProtectedRoute />}>
          <Route path="client-home" element={<ClientInterface />} />
        </Route>
        <Route element={<ArtistProtectedRoute />}>
          <Route path="artist-home" element={<ArtistInterface />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );
  return (
    <>
      <TattooProvider userType={userType} user={user!} loggedIn={loggedIn} authorizationString={authorizationString}>
        <RequestsProvider userType={userType} user={user!} loggedIn={loggedIn} authorizationString={authorizationString}>
          <FavoritesProvider user={user!} authorizationString={authorizationString}>
            <RouterProvider router={router} />
          </FavoritesProvider>
        </RequestsProvider>
      </TattooProvider>
    </>
  );
}

export default App;
