/* eslint-disable react/react-in-jsx-scope */
import { NavLink, Outlet } from "react-router-dom";
import { useAuthContext } from "../providers/auth-provider";

export default function RootLayout() {
  const { loggedIn, logOutUser } = useAuthContext();
  return (
    <div className="root-layout">
      <header>
        <nav>
          <h1 id="site-header">Tattoo Tattle</h1>
          {!loggedIn ? (
            <NavLink to="/">Login</NavLink>
          ) : (
            <NavLink onClick={logOutUser} to="/">
              Logout
            </NavLink>
          )}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
