import { roomSchema } from "@repo/backend-config/types";
import { middleware } from "../middleware/auth.js";

import { Router, type Request, type Response } from "express";
import { db } from "@repo/db/client";
const chatRouter = Router();

chatRouter.post("/chat", middleware, async (req: Request, res: Response) => {
  const userId = req.body.user_id as string;

  const parseData = roomSchema.safeParse(req.body);
  if (!parseData.success) {
    return res.send(403).json({ message: "Invalid inputs" });
  }

  try {
    const room = await db.room.findFirst({
      where: {
        slug: parseData.data.name,
      },
    });

    if (room) {
      return res.status(411).json({ message: "Room name already exist" });
    }

    const newRoom = await db.room.create({
      data: {
        slug: parseData.data.name,
        adminId: userId,
      },
    });

    return res.status(200).json({
      message: "success",
      roomId: newRoom.Room_id,
    });
  } catch (e) {
    console.log(e);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});





chatRouter.get("/room/:roomId" , async(req : Request , res : Response)=> {
    const roomId = Number(req.params.roomId)

    try {
 
        



       const messages = await db.chat.findMany({
        where : {
            roomId :  roomId
        },
        orderBy : {
            roomId : "desc"
        },
        take : 50
       })

        if(!messages){
            return res.status(403).json({message  : "room does not exist"})
        }

        return res.status(200).json({
            messages
        })

    }catch(e) {
        console.log(e)
        return res.status(500).json({message : "Internal Sever error"})
        }
})



export default chatRouter;
