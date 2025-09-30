import { NextFunction, Request, Response } from "express";

import jwt , { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export function middleware(req : Request  , res : Response , next : NextFunction){
  const token  = req.headers["authorization"] as string
  if(!token){
    return res.status(411).json({message : "token not provided"})
  }

  try {
 const decodeToken  = jwt.verify(token , JWT_SECRET)  as JwtPayload
  if(!decodeToken){
    return res.status(411).json({message : "authrization is failed"})
   
  }
   console.log(decodeToken)

  req.body.user_id = decodeToken.userId
  next()

  }catch(e){
    return res.status(500).json("Intenal Server Eror")
  }
 
}