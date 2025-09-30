import { Request, Response, Router } from "express";
import { db } from "@repo/db/client";
import bcrypt from "bcrypt";
import jwt, { sign } from  "jsonwebtoken"
import { JWT_SECRET } from "../config.js";
import { middleware } from "../middleware/auth.js";
const authRouter = Router();
import { signupSchema  , signinSchema , roomSchema} from "@repo/backend-config/types"





authRouter.post("/signup", async (req: Request, res: Response) => {
  const { email, password , firstName , lastName  , avatarUrl }: { email: string; password: string , firstName : string , lastName : string , avatarUrl : string} = req.body;

   const parseData = signupSchema.safeParse(req.body)

   if(!parseData.success){
    return res.status(403).json({
      message  : "Invalid inputs"
    })
   }


  try {
    //existingUser
    const existingUser = await db.user.findFirst({
      where: {
        email: parseData.data.email,
      },
    });

    if (existingUser) {
      return res.status(411).json({ message: "User already exisited" });
    }

    //New User

    await bcrypt.hash(password, 5, async (err, hashPassword) => {
      if (err?.message) {
        console.log(err.message);
        return res.send(500).json({ message: "Internal Server Error" });
      }
      const newUser = await db.user.create({
        data: {
            firstName, 
            lastName,
          email: email,
          password: hashPassword,
          avatar : avatarUrl
        },
      });

      return res.status(200).json({message : "signed up succesfully "})
    });
  } catch (e: any) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

authRouter.post("/signin", async (req: Request, res: Response) => {

    const { email, password }: { email: string; password: string } = req.body;


    try {

    
     const existingUser = await db.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!existingUser) {
      return res.status(411).json({ message: "User does not exist" });
    }

    const hashPassword = await bcrypt.compareSync(password , existingUser.password)

    if(!hashPassword){
       return res.status(411).json({ message: "password  is not correct" });
    }

    const token = jwt.sign({userId : existingUser.User_id} , JWT_SECRET)

    return res.status(200).json({
        message : "Success", 
        token
    })

}catch(e){
    return res.status(500).json({
        message : "Internal server Erro"
    })
}







});



export default authRouter;
