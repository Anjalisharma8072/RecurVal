// import { element } from "prop-types";
import Login from "./components/auth/login/login";
import Register from "./components/auth/register/register";
import InterviewScheduler from "./components/admin/interview";
import Header from "./components/header/header";
import Home from "./components/home";
import { AuthProvider } from "./contexts/authContext";
import { useRoutes } from "react-router-dom";
import LobbyScreen  from "./components/meeting-room/Lobby";
import  RoomPage from "./components/meeting-room/Room";
import JobListings from "./components/candidate/jobsListing";
import JobPortal from "./components/admin/jobposting";
import ScorePage from "./components/admin/ScorePage";

function App() {
  const routesArray = [
    {
      path: "/",
      element: <Home />,
    },
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
      element: <LobbyScreen />,
    },

    {
      path: "/room/:id",
      element: <RoomPage />,
    },

    {
      path: "/jobs",
      element: <JobListings />,
    },
    {
      path: "/post-job",
      element: <JobPortal />,
    },
    {
      path: "/score",
      element: <ScorePage />,
    },
    {
      path: "/schedule-interview",
      element: <InterviewScheduler/>,
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
