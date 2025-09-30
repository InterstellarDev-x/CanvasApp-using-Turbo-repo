import z, { email } from "zod"

export const signupSchema = z.object({
    email : z.email(),
    password : z.string().min(3).max(10),
    firstName : z.string().min(3).max(10),
    lastName : z.string().min(3).max(10)
})


export const signinSchema = z.object({
    email : z.email(),
    password : z.string().min(3).max(10),
})



export const roomSchema = z.object({
    name : z.string()
})

