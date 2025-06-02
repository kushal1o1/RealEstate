import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  },
});

let onlineUsers = new Map(); // Using Map for better user tracking

const addUser = (userId, socketId) => {
  if (!userId) return;
  onlineUsers.set(userId, socketId);
  console.log(`User ${userId} connected. Online users:`, Array.from(onlineUsers.keys()));
};

const removeUser = (socketId) => {
  for (const [userId, id] of onlineUsers.entries()) {
    if (id === socketId) {
      onlineUsers.delete(userId);
      console.log(`User ${userId} disconnected. Online users:`, Array.from(onlineUsers.keys()));
      break;
    }
  }
};

const getUser = (userId) => {
  const socketId = onlineUsers.get(userId);
  return socketId ? { userId, socketId } : null;
};

io.on("connection", (socket) => {
  console.log("New socket connection:", socket.id);

  socket.on("newUser", (userId) => {
    if (userId) {
      addUser(userId, socket.id);
      // Broadcast to all clients that a new user is online
      io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
    }
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      console.log(`Sending message to user ${receiverId} (socket: ${receiver.socketId})`);
      io.to(receiver.socketId).emit("getMessage", {
        ...data,
        chatId: data.chatId,
        senderId: data.userId
      });
    } else {
      console.log(`User ${receiverId} not found online. Message will be delivered when they connect.`);
      // Optionally store the message for later delivery
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
    removeUser(socket.id);
    // Broadcast updated online users list
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  });
});

const PORT = process.env.SOCKET_PORT || 4000;
io.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});