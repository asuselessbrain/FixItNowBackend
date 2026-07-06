import express from "express";
import { userRouter } from "../app/modules/user/user.route";
import { authRouter } from "../app/modules/auth/auth.router";

const router = express.Router();

const routers = [
    {
        path: "/user",
        route: userRouter
    },
    {
        path: "/auth",
        route: authRouter
    }
]

routers.forEach(r=>{
    router.use(r.path, r.route)
})

export default router;