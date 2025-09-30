import WebSocket, { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-config/secret";
import { db } from "@repo/db/client"

const wss = new WebSocketServer({ port: 8080 });
if (wss) {
  console.log("server is running on port 8080");
}

// type usersockets = typeof WebSocket;

// interface RoomsInterface {
//   [key: string]: usersockets[];
// }

interface  RoomsInterface {
  
     socket : WebSocket,
     roomId : string
}



const allSockets : RoomsInterface[] = []


wss.on("connection",  function connection(socket, request) {
  const url = request.url;
  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token");
  if (!token) {
    socket.close();
    return;
  }

  try {
    const decodeToken = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (typeof decodeToken === "string") {
      socket.close();
      return;
    }

    if (!decodeToken.userId || !decodeToken) {
      socket.close();
      return;
    }
  




 
  socket.on("message", async (data) => {
    const MessageObject = JSON.parse(data as unknown as string);

    if (MessageObject.type === "join") {
        allSockets.push({socket : socket , roomId : MessageObject.payload.roomId})
    }

    if(MessageObject.type === "chat"){
        const message = MessageObject.payload.message

        await db.chat.create({
            data : {
                message : message,
                ownerId : decodeToken.userId
            }
        })



        allSockets.filter(s=> (
            s.socket !== socket
        )).map(s => (
            s.socket.send(message)
        ))
    }

    console.log(MessageObject);

  });

  socket.send("connected");

  } catch (e) {
    console.log("not a valid user");
    socket.close();
    return;
  }
});
