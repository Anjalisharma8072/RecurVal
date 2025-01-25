// import { element } from "prop-types";
import Login from "./components/auth/login/login";
import Register from "./components/auth/register/register";

import Header from "./components/header/header";
import Home from "./components/home";
import MeetingRoom from "./components/meeting-room/meetingRoom";

import { AuthProvider } from "./contexts/authContext"
import { useRoutes } from "react-router-dom";

function App() {
  const routesArray = [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/meeting-room",
      element: <MeetingRoom />,
    },
  ];
  let routesElement = useRoutes(routesArray);
  return (
    <AuthProvider>
      <Header />
      <div className="w-full h-screen flex flex-col">{routesElement}</div>
    </AuthProvider>
  );
}

export default App;
