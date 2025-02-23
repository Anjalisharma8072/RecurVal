import  { createContext, useMemo, useContext } from "react";
import PropTypes from "prop-types"; // Importing PropTypes
import { io } from "socket.io-client";

const SocketContext = createContext(null);
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL; 
export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export const SocketProvider = (props) => {
  const socket = useMemo(() => io(`${API_BASE_URL}`), []);

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};


SocketProvider.propTypes = {
  children: PropTypes.node.isRequired, 
};
