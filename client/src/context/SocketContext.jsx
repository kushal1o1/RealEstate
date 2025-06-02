import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Create socket connection
  const connectSocket = useCallback(() => {
    const socketInstance = io("http://localhost:4000", {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.close();
    };
  }, []);

  // Initialize socket connection
  useEffect(() => {
    const cleanup = connectSocket();
    return () => {
      cleanup();
    };
  }, [connectSocket]);

  // Handle user connection
  useEffect(() => {
    if (currentUser?.id && socket && isConnected) {
      console.log("Emitting newUser event for:", currentUser.id);
      socket.emit("newUser", currentUser.id);
    }
  }, [currentUser, socket, isConnected]);

  // Listen for online users updates
  useEffect(() => {
    if (socket) {
      socket.on("getOnlineUsers", (users) => {
        console.log("Online users:", users);
      });
    }
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};