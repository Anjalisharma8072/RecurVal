// import { element } from "prop-types";
import Login from "./components/auth/login/login";
import Register from "./components/auth/register/register";

import Header from "./components/header/header";
import Home from "./components/home";
import CandidateProfile from "./components/candidate/profile";
import { AuthProvider } from "./contexts/authContext";
import { useRoutes } from "react-router-dom";
import LobbyScreen  from "./components/meeting-room/Lobby";
import  RoomPage from "./components/meeting-room/Room";
import JobListings from "./components/candidate/jobsListing";
import JobPortal from "./components/admin/jobposting";
function App() {
  const routesArray = [
    {
      path: "/",
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
      element: <LobbyScreen />,
    },

    {
      path: "/room/:id",
      element: <RoomPage />,
    },
   
    {
      path: "/profile",
      element: <CandidateProfile />,
    },
    {
      path:"/jobs",
      element: <JobListings />,
    },
    {
      path:"/post-job",
      element: <JobPortal />,
    }
    
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
