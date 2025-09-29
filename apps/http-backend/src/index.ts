import express  from "express"
import authRouter from "./routes/auth.js"
const app = express()
app.use(express.json())


app.use("/api/v1" , authRouter)




app.listen(3001 , ()=> {
    console.log("App is listening on port 3001")
})