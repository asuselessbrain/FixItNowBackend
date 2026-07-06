import express from "express";
import { userRouter } from "../app/modules/user/user.route";

const router = express.Router();

const routers = [
    {
        path: "/user",
        route: userRouter
    }
]

routers.forEach(r=>{
    router.use(r.path, r.route)
})

export default router;