import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken"
import  { JWT_SECRET }  from "@repo/backend-config/secret"

const wss = new WebSocketServer({port : 8080})
if(wss){
    console.log("message is running on port 8080")
}

wss.on('connection' , function connection(ws , request){
 
    const url = request.url
    if(!url){
        return 
    }

    const queryParams = new URLSearchParams(url.split("?")[1])
    const token = queryParams.get('token') 
    if(!token){
        return
    }

    const decodeToken  = jwt.verify(token, JWT_SECRET) as JwtPayload

    if(!decodeToken.userId || !decodeToken){
        ws.close()
        return;
    }




    ws.on('message' , (data)=> {
        console.log('received: %s', data);
    })

    ws.send("connected")
})