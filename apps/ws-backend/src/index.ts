import WebSocket, { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-config/secret";
import { db } from "@repo/db/client"


// we have to make stateless backed to track the user rooms 
// we can also use redux or singletion here for state management 
const wss = new WebSocketServer({ port: 8080 });
if (wss) {
  console.log("server is running on port 8080");
}

// type usersockets = typeof WebSocket;

// interface RoomsInterface {
//   [key: string]: usersockets[];
// }

interface  RoomsInterface {
  
     userId : string
     rooms: string[],
     socket : WebSocket
}



const users : RoomsInterface[] = []


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

    users.push({
      userId : decodeToken.userID,
      socket : socket,
      rooms : []
    })


 
  socket.on("message", async (data) => {
    const MessageObject = JSON.parse(data as unknown as string);

    if (MessageObject.type === "join") { 
  
       const user = users.find(x => x.socket === socket)
       user?.rooms.push(MessageObject.payload.roomId)

    }


   if(MessageObject.type === "leave"){
     let user = users.find(x=> x.socket === socket)
     if(!user){
      return null
     }
     user.rooms = user.rooms.filter(s => s !== MessageObject.payload.roomId)
   }

    if(MessageObject.type === "chat"){
        const message = MessageObject.payload.message as string
        const roomId  = MessageObject.payload.roomId as string

        // we should use queue here 

        await db.chat.create({
            data : {
                message : message,
                ownerId : decodeToken.userId,

            }
        })



       //logic for sending the message 
   
      users.forEach((s)=> {
      
       if( s.rooms.includes(roomId)){
        s.socket.send(JSON.stringify({
          type : "message",
          message,
          roomId

        }))
       }

        
    })
       


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
